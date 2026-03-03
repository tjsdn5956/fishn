local Proxy = module("vrp", "lib/Proxy")
local Tunnel = module("vrp", "lib/Tunnel")

vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP", "vRP_fishing_animations")

local arrRestTime  = {}   -- 쿨타임 캐시  [user_id] = os.time()
local playerRodCache = {} -- 낚시대 캐시  [user_id] = {tier, level}

-- ============================================================
-- [1] 낚시대 감지
-- ============================================================

-- vRP 인벤토리에서 플레이어가 보유한 가장 높은 티어·레벨의 낚시대를 반환
-- 반환: tier(1~10), level(0~5) / 없으면 nil, nil
local function getPlayerRod(user_id)
    -- 티어1(최고)부터 오름차순 탐색 → 최고 사양 낚시대를 우선 사용
    for i = 1, #Config.RodTiers do
        local rod = Config.RodTiers[i]
        for level = 5, 0, -1 do
            local itemName = rod.item .. "_" .. level
            if (vRP.getInventoryItemAmount({user_id, itemName}) or 0) >= 1 then
                return rod.tier, level
            end
        end
    end
    return nil, nil
end
-- ============================================================
-- [2] 물고기 확률 시스템
-- ============================================================

--[[
  getFishProbabilities(tier, level)
  ─────────────────────────────────
  반환: {common%, rare%, high%, epic%, legend%, myth%}  합계 = 100

    ■ 등급 해금 규칙 (티어 숫자 낮을수록 고성능)
        · 티어 8~10 (백급·강철·대나무)     : 에픽/전설/신화 = 0%
        · 티어 7    (비브라니움) +0 부터    : 에픽 0.01% 최초 해금
        · 티어 5    (아다만티움) +1 부터    : 전설 소량 해금 시작
        · 티어 3    (엘라륨)     +1 부터    : 신화 소량 해금 시작

  ■ 최대값 (오리하르콘 +5 기준)
    신화 5% · 전설 8% · 에픽 12% · 고급 20% · 희귀 25% · 일반 30%
    → 에픽+전설+신화 = 25% < 일반+희귀+고급 = 75%  (원칙 항상 유지)

  ■ 스코어(score)
    티어7+레벨0 → 0.0,  티어1+레벨5 → 1.0 으로 선형 매핑
    totalSteps = (10-4)*6 + 5 = 41
--]]
local function getFishProbabilities(tier, level)
    -- 기존 계산식(티어 높을수록 고성능)을 재사용하기 위한 변환값
    -- oldTier: 1(최저) ~ 10(최고)
    local oldTier = 11 - tier

    -- 티어 8~10: 에픽 이상 없음
    if oldTier <= 3 then
        return {65.0, 25.0, 10.0, 0.0, 0.0, 0.0}
    end

    local score = ((oldTier - 4) * 6 + level) / 41.0  -- 0.0 ~ 1.0

    -- 신화 (엘라륨 티어3부터 해금, 최대 5%)
    local mythChance = 0.0
    if oldTier >= 8 then
        mythChance = (((oldTier - 8) * 6 + level) / 17.0) * 5.0
    end

    -- 전설 (아다만티움 티어5부터 해금, 최대 8%)
    local legendChance = 0.0
    if oldTier >= 6 then
        legendChance = (((oldTier - 6) * 6 + level) / 29.0) * 8.0
    end

    -- 에픽 (비브라니움 티어7부터 0.01% → 최대 12%)
    local epicChance = 0.01 + score * 11.99

    -- 고급 (10% → 20%)
    local highChance = 10.0 + score * 10.0

    -- 일반 (65% → 30%, 최솟값 30% 보장)
    local commonChance = math.max(30.0, 65.0 - score * 35.0)

    -- 희귀 = 나머지 채움 (항상 양수 — 최악의 경우 25% 이상 확보됨)
    local rareChance = 100.0 - commonChance - highChance - epicChance - legendChance - mythChance

    return {commonChance, rareChance, highChance, epicChance, legendChance, mythChance}
end

-- 확률 배열로 등급(문자열) 결정
local gradeKeys = {"common", "rare", "high", "epic", "legend", "myth"}

local function rollGrade(probs)
    local roll = math.random() * 100.0
    local cumulative = 0.0
    for i, prob in ipairs(probs) do
        cumulative = cumulative + prob
        if roll < cumulative then
            return gradeKeys[i]
        end
    end
    return "common" -- 부동소수점 오차 대비 폴백
end

-- 등급에서 랜덤 물고기 아이템 1개 선택
local function pickFishItem(grade)
    local items = Config.FishItems[grade]
    if not items or #items == 0 then
        return Config.FishItems.common[1]
    end
    return items[math.random(#items)]
end

-- ============================================================
-- [3] 이벤트 핸들러
-- ============================================================

-- fishing:start ─ 낚시 시작 요청
-- 낚시대 보유 여부를 검사하고 클라이언트에 낚시대 티어·레벨을 회신
RegisterServerEvent("fishing:start")
AddEventHandler("fishing:start", function()
    local src     = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local tier, level = getPlayerRod(user_id)

    if tier then
        -- 캐시 갱신 후 클라이언트에 낚시대 정보 전달
        playerRodCache[user_id] = {tier = tier, level = level}
        TriggerClientEvent("fishing:rodInfo", src, tier, level)
    else
        -- 낚시대 없음 → 클라이언트에 실패 알림
        TriggerClientEvent("fishing:noRod", src)
    end
end)

-- fishing:reward ─ 미니게임 성공 → 물고기 지급
RegisterServerEvent("fishing:reward")
AddEventHandler("fishing:reward", function()
    local src     = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local player = vRP.getUserSource({user_id})

    -- 쿨타임 체크 (10초)
    local ctime = os.time()
    if arrRestTime[user_id] and ctime - 10 < arrRestTime[user_id] then
        vRPclient.notify(player, {"~r~[오류] ~w~시스템 제한"})
        return
    end
    arrRestTime[user_id] = ctime

    -- 낚시대 정보 (캐시 우선, 없으면 재조회)
    local rodInfo = playerRodCache[user_id]
    if not rodInfo then
        local tier, level = getPlayerRod(user_id)
        if not tier then
            vRPclient.notify(player, {"~r~낚시대가 없습니다!"})
            return
        end
        rodInfo = {tier = tier, level = level}
        playerRodCache[user_id] = rodInfo
    end

    -- 인벤토리 무게 체크
    local curWeight = vRP.getInventoryWeight({user_id})
    local maxWeight = vRP.getInventoryMaxWeight({user_id})

    -- 등급 결정 → 물고기 아이템 선택
    local probs = getFishProbabilities(rodInfo.tier, rodInfo.level)
    local grade = rollGrade(probs)
    local item  = pickFishItem(grade)

    if curWeight + vRP.getItemWeight({item}) > maxWeight then
        vRPclient.notify(player, {"~r~인벤토리가 가득 찼습니다!"})
        return
    end

    vRP.giveInventoryItem({user_id, item, 1})

    -- 등급 알림 (색상 + 등급명 + 낚시대명)
    local display = Config.GradeDisplay[grade] or {color = "~w~", name = "물고기"}
    local rodName = Config.RodTiers[rodInfo.tier].name .. " +" .. rodInfo.level
    vRPclient.notify(player, {
        display.color .. "[" .. display.name .. "] ~w~물고기를 낚았습니다!~n~" ..
        "~s~(" .. rodName .. ")"
    })
end)
