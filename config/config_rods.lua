-- ============================================================
-- config_rods.lua  (shared — 클라이언트 · 서버 양쪽에서 로드됨)
-- ============================================================
Config = Config or {}

-- ── 낚시대 티어 (1: 오리하르콘 ~ 10: 대나무) ──────────────────
-- item  : vRP 인벤토리 아이템 접두어. 실제 아이템명은 item.."_"..level
--         예) rod_bamboo_0 / rod_bamboo_1 / ... / rod_bamboo_5
-- name  : UI 표시명
-- tier  : 내부 티어 번호 (1~10)
Config.RodTiers = {
    { item = "rod_orichalcum", name = "오리하르콘", tier = 1  },
    { item = "rod_kainum",     name = "카이늄",     tier = 2  },
    { item = "rod_elarum",     name = "엘라륨",     tier = 3  },
    { item = "rod_mithril",    name = "미스릴",     tier = 4  },
    { item = "rod_adamantium", name = "아다만티움", tier = 5  },
    { item = "rod_ertel",      name = "에르텔",     tier = 6  },
    { item = "rod_vibranium",  name = "비브라니움", tier = 7  },
    { item = "rod_silver",     name = "백급",       tier = 8  },
    { item = "rod_steel",      name = "강철",       tier = 9  },
    { item = "rod_bamboo",     name = "대나무",     tier = 10 },
}

-- ── 미니게임 출현 대기 시간 (초) ──────────────────────────────
-- 강화 수치(+0~+5)는 영향 없음. 진화 티어만 적용.
-- 티어1(오리하르콘): min초 / 티어10(대나무): max초 / 중간 티어: 선형 증가
Config.FishingInterval = {
    max = 30.0,   -- 대나무 대기 시간 (초)
    min = 5.0,    -- 오리하르콘 대기 시간 (초)
}

-- ── 등급별 물고기 아이템 목록 ─────────────────────────────────
-- 각 배열에서 랜덤 1개가 지급됩니다.
-- vRP cfg/items.lua 에 동일한 이름으로 아이템을 등록해야 합니다.
Config.FishItems = {
    -- 일반 (30종)
    common = {
        "fish_common_crucian",        "fish_common_carp",           "fish_common_bass",
        "fish_common_catfish",        "fish_common_loach",          "fish_common_gudgeon",
        "fish_common_smelt",          "fish_common_minnow",         "fish_common_killifish",
        "fish_common_bitterling",     "fish_common_anchovy",        "fish_common_sardine",
        "fish_common_herring",        "fish_common_mackerel",       "fish_common_mullet",
        "fish_common_goby",           "fish_common_mudskipper",     "fish_common_filefish",
        "fish_common_rockfish_small", "fish_common_sand_lance",     "fish_common_stone_moroko",
        "fish_common_spined_loach",   "fish_common_pale_chub",      "fish_common_japanese_dace",
        "fish_common_sweetfish",      "fish_common_topmouth",       "fish_common_harlequin",
        "fish_common_weatherfish",    "fish_common_prickle_fish",   "fish_common_puffer_small",
    },
    -- 희귀 (25종)
    rare = {
        "fish_rare_trout",    "fish_rare_salmon",    "fish_rare_eel",
        "fish_rare_sea_bass", "fish_rare_flounder",  "fish_rare_plaice",
        "fish_rare_cod",      "fish_rare_pollock",   "fish_rare_yellowfin",
        "fish_rare_snapper",  "fish_rare_grouper",   "fish_rare_jack",
        "fish_rare_octopus",  "fish_rare_squid",     "fish_rare_cuttlefish",
        "fish_rare_conger",   "fish_rare_ribbonfish","fish_rare_hairtail",
        "fish_rare_gurnard",  "fish_rare_seabream",  "fish_rare_whitebait",
        "fish_rare_pompano",  "fish_rare_halfbeak",  "fish_rare_needlefish",
        "fish_rare_saury",
    },
    -- 고급 (20종)
    high = {
        "fish_high_tuna",         "fish_high_swordfish",    "fish_high_marlin",
        "fish_high_mahi",         "fish_high_amberjack",    "fish_high_yellowtail",
        "fish_high_kingfish",     "fish_high_wahoo",        "fish_high_cobia",
        "fish_high_tarpon",       "fish_high_barracuda",    "fish_high_sailfish",
        "fish_high_sea_trout",    "fish_high_halibut",      "fish_high_striped_bass",
        "fish_high_opah",         "fish_high_oarfish_small","fish_high_lancetfish",
        "fish_high_scabbard",     "fish_high_sunfish_small",
    },
    -- 에픽 (12종)
    epic = {
        "fish_epic_shark",      "fish_epic_manta",      "fish_epic_hammerhead",
        "fish_epic_bull_shark", "fish_epic_tiger_shark","fish_epic_great_white",
        "fish_epic_thresher",   "fish_epic_oarfish",    "fish_epic_basking",
        "fish_epic_goblin_shark","fish_epic_frilled_shark","fish_epic_megamouth",
    },
    -- 전설 (8종)
    legend = {
        "fish_legend_leviathan",  "fish_legend_kraken",       "fish_legend_sea_serpent",
        "fish_legend_coelacanth", "fish_legend_megalodon",    "fish_legend_abyssal_dragon",
        "fish_legend_ocean_titan","fish_legend_abyss_guardian",
    },
    -- 신화 (5종)
    myth = {
        "fish_myth_poseidon", "fish_myth_tiamat", "fish_myth_jormungandr",
        "fish_myth_ryujin",   "fish_myth_makara",
    },
}

-- ── 등급 표시 설정 (알림 색상 · 이름) ────────────────────────
Config.GradeDisplay = {
    common = { color = "~w~", name = "일반" },
    rare   = { color = "~b~", name = "희귀" },
    high   = { color = "~g~", name = "고급" },
    epic   = { color = "~p~", name = "에픽" },
    legend = { color = "~y~", name = "전설" },
    myth   = { color = "~r~", name = "신화" },
}
