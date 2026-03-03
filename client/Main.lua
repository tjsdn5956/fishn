local Config = _G.Config

if not Config then
    error("[vrp_fishing] Missing Config table. Ensure config.lua loads before client scripts.")
end

local npcPed
local interactionCam
local isUiOpen = false
local visibilityThreadActive = false
local isHeadLabelOverlayVisible = false

local function loadModel(modelName)
    local model = type(modelName) == "number" and modelName or joaat(modelName)
    local logPrefix = Config.LogPrefix or "vrp_fishing"

    if not IsModelInCdimage(model) then
        print(("[%s] Invalid NPC model: %s"):format(logPrefix, modelName))
        return nil
    end

    RequestModel(model)

    local timeoutAt = GetGameTimer() + Config.Timing.modelLoadTimeout

    while not HasModelLoaded(model) do
        if GetGameTimer() > timeoutAt then
            print(("[%s] Model load timeout: %s"):format(logPrefix, modelName))
            return nil
        end

        Wait(0)
    end

    return model
end

local function syncUiConfig()
    SendNUIMessage({
        action = "syncUiConfig",
        npcRole = Config.Npc.labelRole,
        npcName = Config.Npc.labelName,
        uiConfig = Config.Ui
    })
end

local function hideNpcHeadLabelOverlay()
    if not isHeadLabelOverlayVisible then
        return
    end

    isHeadLabelOverlayVisible = false

    SendNUIMessage({
        action = "setHeadLabel",
        visible = false
    })
end

local function updateNpcHeadLabelOverlay()
    if not npcPed or not DoesEntityExist(npcPed) then
        hideNpcHeadLabelOverlay()
        return
    end

    local headCoords = GetPedBoneCoords(npcPed, Config.Npc.headBone, 0.0, 0.0, 0.0)
    local labelOffset = Config.HeadLabel.offset
    local labelCoords = vector3(
        headCoords.x + labelOffset.x,
        headCoords.y + labelOffset.y,
        headCoords.z + labelOffset.z
    )
    local onScreen, screenX, screenY = World3dToScreen2d(labelCoords.x, labelCoords.y, labelCoords.z)

    if not onScreen then
        hideNpcHeadLabelOverlay()
        return
    end

    isHeadLabelOverlayVisible = true

    SendNUIMessage({
        action = "setHeadLabel",
        visible = true,
        x = screenX,
        y = screenY,
        npcRole = Config.Npc.labelRole,
        npcName = Config.Npc.labelName
    })
end

local function destroyInteractionCam()
    if interactionCam and DoesCamExist(interactionCam) then
        RenderScriptCams(false, true, Config.Camera.easeTime, true, true)
        DestroyCam(interactionCam, false)
        interactionCam = nil
    end
end

local function setLocalPlayerHidden(hidden)
    local playerId = PlayerId()
    local playerPed = PlayerPedId()

    if hidden then
        SetPlayerInvisibleLocally(playerId, true)
        SetEntityLocallyInvisible(playerPed)
        return
    end

    SetPlayerInvisibleLocally(playerId, false)
end

local function ensureLocalPlayerHiddenWhileUiOpen()
    if visibilityThreadActive then
        return
    end

    visibilityThreadActive = true

    CreateThread(function()
        while isUiOpen do
            setLocalPlayerHidden(true)
            Wait(0)
        end

        setLocalPlayerHidden(false)
        visibilityThreadActive = false
    end)
end

local function createInteractionCam()
    if not npcPed or not DoesEntityExist(npcPed) then
        return
    end

    destroyInteractionCam()

    local offset = Config.Camera.offset
    local positionOffset = Config.Camera.positionOffset
    local camCoords = GetOffsetFromEntityInWorldCoords(npcPed, offset.x, offset.y, offset.z)
    local lookCoords = GetPedBoneCoords(npcPed, Config.Npc.headBone, 0.0, 0.0, 0.0)
    local baseCoords = GetEntityCoords(npcPed)
    local positionOffsetCoords = GetOffsetFromEntityInWorldCoords(
        npcPed,
        positionOffset.x,
        positionOffset.y,
        positionOffset.z
    )
    local shiftedCamCoords = vector3(
        camCoords.x + (positionOffsetCoords.x - baseCoords.x),
        camCoords.y + (positionOffsetCoords.y - baseCoords.y),
        camCoords.z + (positionOffsetCoords.z - baseCoords.z)
    )

    interactionCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)

    SetCamCoord(interactionCam, camCoords.x, camCoords.y, camCoords.z)
    PointCamAtCoord(interactionCam, lookCoords.x, lookCoords.y, lookCoords.z + Config.Npc.lookAtZOffset)
    SetCamCoord(interactionCam, shiftedCamCoords.x, shiftedCamCoords.y, shiftedCamCoords.z)
    SetCamFov(interactionCam, Config.Camera.fov)
    SetCamActive(interactionCam, true)
    RenderScriptCams(true, true, Config.Camera.easeTime, true, true)
end

local function setPlayerFacingNpc()
    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    local npcCoords = GetEntityCoords(npcPed)
    local heading = GetHeadingFromVector_2d(npcCoords.x - playerCoords.x, npcCoords.y - playerCoords.y)

    SetEntityHeading(playerPed, heading)
end

local function closeFishingUi()
    if not isUiOpen then
        return
    end

    isUiOpen = false

    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        action = "toggle",
        visible = false
    })

    FreezeEntityPosition(PlayerPedId(), false)
    setLocalPlayerHidden(false)
    hideNpcHeadLabelOverlay()
    destroyInteractionCam()
end

local function openFishingUi()
    if isUiOpen or not npcPed or not DoesEntityExist(npcPed) then
        return
    end

    local playerPed = PlayerPedId()

    if IsPedInAnyVehicle(playerPed, false) then
        return
    end

    isUiOpen = true

    SetCurrentPedWeapon(playerPed, joaat(Config.Player.unarmedWeapon), true)
    setPlayerFacingNpc()
    FreezeEntityPosition(playerPed, true)
    hideNpcHeadLabelOverlay()
    createInteractionCam()
    ensureLocalPlayerHiddenWhileUiOpen()
    syncUiConfig()

    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        action = "toggle",
        visible = true,
        npcRole = Config.Npc.labelRole,
        npcName = Config.Npc.labelName
    })
end

local function createNpc()
    if npcPed and DoesEntityExist(npcPed) then
        return
    end

    local model = loadModel(Config.Npc.model)

    if not model then
        return
    end

    local coords = Config.Npc.coords

    npcPed = CreatePed(
        Config.Npc.pedType,
        model,
        coords.x,
        coords.y,
        coords.z - Config.Npc.spawnZOffset,
        coords.w,
        false,
        true
    )

    SetEntityAsMissionEntity(npcPed, true, true)
    SetBlockingOfNonTemporaryEvents(npcPed, true)
    SetEntityInvincible(npcPed, true)
    FreezeEntityPosition(npcPed, true)
    SetPedCanRagdoll(npcPed, false)
    SetPedDiesWhenInjured(npcPed, false)
    SetPedCanPlayAmbientAnims(npcPed, true)
    SetPedCanPlayAmbientBaseAnims(npcPed, true)
    TaskStartScenarioInPlace(npcPed, Config.Npc.scenario, 0, true)

    SetModelAsNoLongerNeeded(model)
end

RegisterNUICallback("close", function(_, cb)
    closeFishingUi()
    cb({ ok = true })
end)

RegisterNUICallback("selectAction", function(_, cb)
    cb({ ok = true })
end)

RegisterNUICallback("sellFish", function(data, cb)
    -- data.itemId  : 단일 어종 판매 시 해당 어종 ID
    -- data.sellAll : true 이면 전체 판매
    -- TODO: 인벤토리 시스템 연동 후 실제 판매 처리 구현
    cb({ ok = true })
end)

CreateThread(function()
    Wait(Config.Timing.initialNpcSpawnDelay)
    createNpc()
    syncUiConfig()

    while true do
        if not npcPed or not DoesEntityExist(npcPed) then
            hideNpcHeadLabelOverlay()
            createNpc()
            Wait(Config.Timing.respawnRetryDelay)
        else
            local playerPed = PlayerPedId()
            local distance = #(GetEntityCoords(playerPed) - GetEntityCoords(npcPed))
            local sleep = 1000

            if distance <= Config.Npc.promptDistance then
                sleep = 0

                if not isUiOpen then
                    local canInteract = not IsPedInAnyVehicle(playerPed, false) and distance <= Config.Npc.interactDistance

                    updateNpcHeadLabelOverlay()

                    if canInteract and IsControlJustReleased(0, Config.Npc.interactKey) then
                        openFishingUi()
                    end
                else
                    hideNpcHeadLabelOverlay()
                end
            else
                hideNpcHeadLabelOverlay()
            end

            Wait(sleep)
        end
    end
end)

AddEventHandler("onResourceStop", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then
        return
    end

    isUiOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    setLocalPlayerHidden(false)
    hideNpcHeadLabelOverlay()
    destroyInteractionCam()

    if npcPed and DoesEntityExist(npcPed) then
        DeletePed(npcPed)
        npcPed = nil
    end
end)
