vRP = Proxy.getInterface("vRP")

local Caught_KEY             = 246    -- Y키
local SuccessLimit           = 0.07
local AnimationSpeed         = 0.0025
local ShowChatMSG            = true
local isRest                 = false
local DockWaterCheckDistance = 0.5
local MaxWaterHeightDiff     = 4.0    -- 플레이어와 수면의 최대 높이 차이 (미터)
local NaturalWaterRadius     = 8.0    -- 자연수 판별 확산 반경 (미터)
local NaturalWaterMinHits    = 3      -- 8방향 중 물 감지 최소 수

local waterProbeOffsets = {
    {0.0, 0.0},
    {DockWaterCheckDistance, 0.0}, {-DockWaterCheckDistance, 0.0},
    {0.0, DockWaterCheckDistance}, {0.0, -DockWaterCheckDistance},
    {2.1, 2.1}, {-2.1, 2.1}, {2.1, -2.1}, {-2.1, -2.1}
}

local naturalWaterDirs = {
    {1.0, 0.0}, {-1.0, 0.0}, {0.0, 1.0}, {0.0, -1.0},
    {0.707, 0.707}, {-0.707, 0.707}, {0.707, -0.707}, {-0.707, -0.707}
}

-- ── 낚시대 상태 (서버에서 수신) ────────────────────────────────
local currentRodTier    = 1   -- 현재 낚시대 티어 (1~10)
local currentRodLevel   = 0   -- 현재 낚시대 강화 레벨 (0~5)
local pendingFishStart  = false -- 서버 응답 대기 중 중복 요청 방지

-- ── 미니게임 상태 변수 ─────────────────────────────────────────
local IsFishing         = false
local CFish             = false
local BarAnimation      = 0
local Faketimer         = 0
local RunCodeOnly1Time  = true
local PosY              = 0.1
local TimerAnimation    = 0.1
local MaxBarSize        = 0.1
local up                = true
local catchPromptVisible = false
local minigameVisible    = false

-- ============================================================
-- 티어 기반 미니게임 대기 시간 계산
-- 티어1(오리하르콘) = min초, 티어10(대나무) = max초, 선형 증가
-- ============================================================
local function getRodWaitTime(tier)
    local maxMs = Config.FishingInterval.max * 1000
    local minMs = Config.FishingInterval.min * 1000
    local t = (tier - 1) / 9.0   -- 0.0(티어1) ~ 1.0(티어10)
    return math.floor(minMs + (maxMs - minMs) * t)
end

-- ============================================================
-- 수질 감지 유틸
-- ============================================================
local function isNaturalWater(x, y, waterZ)
    local hits = 0
    for _, dir in ipairs(naturalWaterDirs) do
        local testZ = GetWaterHeight(x + dir[1] * NaturalWaterRadius,
                                     y + dir[2] * NaturalWaterRadius, waterZ + 1.0)
        if testZ and math.abs(testZ - waterZ) < 0.5 then
            hits = hits + 1
        end
    end
    return hits >= NaturalWaterMinHits
end

local function canFishFromDockOrWater(ped)
    if IsEntityInWater(ped) and not IsPedSwimming(ped) then
        return true
    end
    local pedCoords = GetEntityCoords(ped)
    for _, offset in ipairs(waterProbeOffsets) do
        local probeX = pedCoords.x + offset[1]
        local probeY = pedCoords.y + offset[2]
        local waterZ = GetWaterHeight(probeX, probeY, pedCoords.z + 1.0)
        if waterZ and (pedCoords.z - waterZ) <= MaxWaterHeightDiff
                  and isNaturalWater(probeX, probeY, waterZ) then
            return true
        end
    end
    return false
end

-- ============================================================
-- NUI 유틸
-- ============================================================
local function clampValue(value, minValue, maxValue)
    if value < minValue then return minValue end
    if value > maxValue then return maxValue end
    return value
end

local function setCatchPromptVisible(visible)
    if catchPromptVisible == visible then return end
    catchPromptVisible = visible
    SendNUIMessage({action = "catchPrompt", visible = visible})
end

local function setMinigameVisible(visible)
    if minigameVisible == visible then return end
    minigameVisible = visible
    SendNUIMessage({action = "minigame", visible = visible})
end

local function hideFishingUI()
    setCatchPromptVisible(false)
    setMinigameVisible(false)
    SendNUIMessage({
        action      = "progress",
        timer       = 0,
        bar         = 0,
        success     = clampValue(SuccessLimit / MaxBarSize, 0, 1),
        successState = false
    })
end

-- ============================================================
-- 네트워크 이벤트 핸들러
-- ============================================================

-- 서버가 낚시대 보유 확인 후 회신 → 낚시 시작
RegisterNetEvent("fishing:rodInfo")
AddEventHandler("fishing:rodInfo", function(tier, level)
    pendingFishStart  = false
    currentRodTier    = tier
    currentRodLevel   = level
    IsFishing         = true
    RunCodeOnly1Time  = true
    BarAnimation      = 0
    if ShowChatMSG then
        notify("~y~낚시를 시작합니다. [" ..
               Config.RodTiers[tier].name .. " +" .. level .. "]")
    end
end)

-- 낚시대 없음
RegisterNetEvent("fishing:noRod")
AddEventHandler("fishing:noRod", function()
    pendingFishStart = false
    notify("~r~낚시대가 없습니다!")
end)

-- 외부에서 낚시 강제 취소
RegisterNetEvent("cancel")
AddEventHandler("cancel", function()
    pendingFishStart = false
    IsFishing        = false
    CFish            = false
    TimerAnimation   = MaxBarSize
    hideFishingUI()
end)

-- ============================================================
-- 메인 스레드
-- ============================================================
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1)
        local ped = GetPed()
        local canFishInWater = canFishFromDockOrWater(ped)

        -- Y키 감지 → 서버에 낚시 시작 요청
        if not isRest and not IsFishing and not CFish and not pendingFishStart
                      and IsControlJustReleased(1, Caught_KEY) then
            if not IsPedInAnyVehicle(ped, false) then
                if canFishInWater then
                    pendingFishStart = true
                    TriggerServerEvent("fishing:start")
                else
                    notify("~r~물가 또는 선착장에서만 낚시할 수 있습니다.")
                end
            end
        end

        -- 물가 힌트 텍스트
        if not IsFishing and not CFish and not pendingFishStart and canFishInWater then
            painelNovo_txt(0.885, 0.9, 1.0, 1.0, 0.3,
                "~y~[Y]~w~키를 눌러 낚시를 시작합니다!", 255, 255, 255, 250, 1)
        end

        -- 낚시 애니메이션 대기 (tiered wait time)
        while IsFishing do
            local waitTime = getRodWaitTime(currentRodTier)
            TaskStandStill(GetPed(), waitTime + 7000)
            FishRod = AttachEntityToPed("prop_fishing_rod_01", 60309, 0, 0, 0, 0, 0, 0)

            -- [1] 캐스팅 애니메이션 1회만 재생 (3.5초)
            PlayAnim(GetPed(), "amb@world_human_stand_fishing@base", "base", 1, 3500)
            Citizen.Wait(3500)

            -- [2] 캐스팅 후 대기 자세 루프 (미니게임 전환 시 동일 애니메이션 유지 → 끊김 없음)
            PlayAnimLoop(GetPed(), "amb@world_human_stand_fishing@idle_a", "idle_c")
            Citizen.Wait(math.max(waitTime - 3500, 0))

            CFish     = true
            IsFishing = false
        end

        -- 미니게임 루프
        while CFish do
            Citizen.Wait(1)
            FishGUI(true)

            if RunCodeOnly1Time then
                Faketimer        = 3
                RunCodeOnly1Time = false
                -- 대기 루프에서 이미 idle_c 가 재생 중이므로 별도 재시작 불필요
                -- (미니게임 전환 시 끊김 방지)
            end

            -- 시간 초과 → 놓침
            if TimerAnimation <= 0 then
                CFish          = false
                TimerAnimation = MaxBarSize
                StopAnimTask(GetPed(), "amb@world_human_stand_fishing@idle_a", "idle_c", 2.0)
                Citizen.Wait(200)
                SetEntityAsMissionEntity(FishRod)
                Citizen.Wait(100)
                DetachEntity(FishRod, true, true)
                DeleteObject(FishRod)
                notify("~r~물고기를 놓쳤습니다!")
                FishGUI(false)
            end

            -- Y키 입력
            if not isRest and IsControlJustReleased(1, Caught_KEY) then
                CFish          = false
                TimerAnimation = MaxBarSize
                StopAnimTask(GetPed(), "amb@world_human_stand_fishing@idle_a", "idle_c", 2.0)
                Citizen.Wait(200)
                SetEntityAsMissionEntity(FishRod)
                Citizen.Wait(100)
                DetachEntity(FishRod, true, true)
                DeleteObject(FishRod)

                if BarAnimation >= SuccessLimit then
                    notify("~g~무언가 낚시대에 걸렸습니다!")
                    TriggerServerEvent("fishing:reward")
                else
                    notify("~r~물고기를 놓쳤습니다!")
                end

                FishGUI(false)
            end
        end
    end
end)

-- Faketimer 보조 스레드
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)
        Faketimer = Faketimer + 1
    end
end)

-- 기절/사망 감지 스레드
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)
        isRest = vRP.isInComa({}) or vRP.isInDie({})
    end
end)

-- ============================================================
-- 공유 함수
-- ============================================================
function GetPed()
    return GetPlayerPed(-1)
end

function FishGUI(bool)
    if not bool then
        hideFishingUI()
        return
    end
    setCatchPromptVisible(true)
    setMinigameVisible(true)
    SendNUIMessage({
        action       = "progress",
        timer        = clampValue(TimerAnimation / MaxBarSize, 0, 1),
        bar          = clampValue(BarAnimation / MaxBarSize, 0, 1),
        success      = clampValue(SuccessLimit / MaxBarSize, 0, 1),
        successState = BarAnimation >= SuccessLimit
    })
    TimerAnimation = TimerAnimation - 0.0001025
    if BarAnimation <= 0 then up = true end
    if BarAnimation >= PosY then up = false end
    BarAnimation = BarAnimation + (up and AnimationSpeed or -AnimationSpeed)
end

-- 애니메이션 단순 루프 재생 (무한 반복, 끊김 없는 대기 자세용)
function PlayAnimLoop(ped, base, sub)
    Citizen.CreateThread(function()
        RequestAnimDict(base)
        while not HasAnimDictLoaded(base) do Citizen.Wait(1) end
        -- flag 1 = 루프, duration -1 = 무한
        TaskPlayAnim(ped, base, sub, 8.0, -8.0, -1, 1, 0, 0, 0, 0)
    end)
end

function PlayAnim(ped, base, sub, nr, time)
    Citizen.CreateThread(function()
        RequestAnimDict(base)
        while not HasAnimDictLoaded(base) do Citizen.Wait(1) end
        if IsEntityPlayingAnim(ped, base, sub, 3) then
            ClearPedSecondaryTask(ped)
        else
            for i = 1, nr do
                TaskPlayAnim(ped, base, sub, 8.0, -8, -1, 16, 0, 0, 0, 0)
                Citizen.Wait(time)
            end
        end
    end)
end

function AttachEntityToPed(prop, bone_ID, x, y, z, RotX, RotY, RotZ)
    local boneID = GetPedBoneIndex(GetPed(), bone_ID)
    local obj = CreateObject(GetHashKey(prop), 1729.73, 6403.90, 34.56, true, true, true)
    AttachEntityToEntity(obj, GetPed(), boneID, x, y, z, RotX, RotY, RotZ,
                         false, false, false, false, 2, true)
    return obj
end

function painelNovo_txt(x, y, width, height, scale, text, r, g, b, a, font)
    SetTextFont(6)
    SetTextProportional(0)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x - width / 2, y - height / 2 + 0.005)
end

function notify(text)
    vRP.notify({text})
end

AddEventHandler("onResourceStop", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        hideFishingUI()
    end
end)
