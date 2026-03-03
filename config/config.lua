Config = Config or {}

Config.LogPrefix = "vrp_fishing"

Config.Npc = {
    coords = vector4(-1202.41, -1794.7, 3.91, 128.41),
    model = "cs_old_man1a",
    pedType = 4,
    spawnZOffset = 1.0,
    scenario = "WORLD_HUMAN_CLIPBOARD",
    promptDistance = 8.0,
    interactDistance = 2.0,
    interactKey = 38,
    headBone = 31086,
    lookAtZOffset = 0.03,
    labelRole = "입질만 기다리는",
    labelName = "다낚아"
}

Config.Camera = {
    offset = vector3(1.0, 1.2, 0.9),
    positionOffset = vector3(-0.35, 0.0, 0.0),
    fov = 38.0,
    easeTime = 600
}

Config.HeadLabel = {
    offset = vector3(0.0, 0.0, 0.20)
}

Config.Player = {
    unarmedWeapon = "WEAPON_UNARMED"
}

Config.Timing = {
    modelLoadTimeout = 5000,
    initialNpcSpawnDelay = 500,
    respawnRetryDelay = 1000
}

Config.Ui = {
    panelHeader = "낚시 교관 메뉴",
    defaultDialogue = "어이, 젊은이. 오늘도 낚시하러 왔나? 필요한 게 있으면 말해보게.",
    backLabel = "뒤로가기",
    menuData = {
        shop = {
            navLabel = "상점",
            section = "낚시 상점",
            title = "기본 장비 상점",
            description = "입문용 낚싯대, 미끼, 소모품을 구매할 수 있습니다. 기본 장비를 먼저 갖춰두면 퀘스트와 도감 진행이 훨씬 수월해집니다.",
            tags = { "낚싯대", "미끼", "소모품" },
            actionLabel = "상점 열기",
            actionMessage = "필요한 장비부터 챙기게. 장비가 갖춰져야 낚시도 제대로 굴러가지.",
            dialogue = "처음이면 상점부터 보는 게 맞네. 장비 없이 물가부터 가봐야 고생만 하지."
        },
        collection = {
            navLabel = "도감",
            section = "어류 도감",
            title = "도감 진행도",
            description = "잡은 물고기는 도감에 자동 등록됩니다. 아직 비어 있는 어종을 확인하고, 희귀 어종 보상이나 수집 보너스를 노려보세요.",
            tags = { "자동 등록", "희귀 어종", "수집 보상" },
            actionLabel = "도감 열기",
            actionMessage = "도감은 꾸준함이 전부지. 빠진 어종부터 채워가면 보상이 쌓일 걸세.",
            dialogue = "잡은 물고기를 그냥 넘기지 말고 도감도 챙기게. 모아두면 꽤 쏠쏠하지."
        },
        quest = {
            navLabel = "퀘스트",
            section = "낚시 퀘스트",
            title = "일일 납품 의뢰",
            description = "매일 갱신되는 낚시 의뢰를 완료하면 경험치와 보상을 받을 수 있습니다. 일반 어종부터 희귀 어종까지 요구량을 확인하고 진행하세요.",
            tags = { "일일 갱신", "납품 보상", "추가 경험치" },
            actionLabel = "퀘스트 확인",
            actionMessage = "오늘 할당량부터 챙기게. 퀘스트만 꾸준히 돌아도 성장 속도가 꽤 빠르지.",
            dialogue = "퀘스트는 빼먹지 말게. 장비도 성장도 결국 매일 쌓아야 차이가 나는 법이야."
        },
        sell = {
            navLabel = "판매",
            section = "물고기 판매",
            title = "판매 목록",
            description = "보유 중인 물고기를 판매합니다. 등급이 높을수록 판매 금액이 올라갑니다.",
            tags = { "현금 지급", "즉시 판매", "등급 보정" },
            actionLabel = "전체 판매",
            actionMessage = "좋은 어획량이군. 제대로 값을 쳐주지.",
            dialogue = "잡아온 물고기, 내가 제값에 사줄 테니 한번 내놔보게."
        }
    },
    sellView = {
        balance = 0,           -- 서버에서 플레이어 실제 보유 금액으로 갱신
        currencySuffix = "COIN",
        balanceLabel = "보유 코인",
        balanceMeta = "등급이 높은 물고기일수록 단가가 높습니다.",
        sellAllLabel = "전체 판매",
        items = {}             -- 서버에서 플레이어 인벤토리 기반으로 동적 갱신
    },
    questView = {
        tabs = {
            {
                key = "daily",
                label = "일일 퀘스트",
                refreshLabel = "매일 00:00 초기화",
                title = "오늘의 납품 의뢰",
                description = "매일 가볍게 진행할 수 있는 반복 의뢰입니다. 꾸준히 채우면 코인과 성장 재화를 안정적으로 모을 수 있습니다.",
                dialogue = "하루치 할당량은 가볍게 비워두는 게 좋지. 작은 적립이 결국 큰 차이를 만든다네.",
                items = {
                    {
                        id = "daily_common",
                        name = "손맛 익히기",
                        description = "일반 등급 물고기를 납품해 기본 보상을 챙기세요.",
                        requirement = "일반 물고기 10마리 납품",
                        progress = "0/10",
                        reward = "2,000 COIN",
                        status = "진행 가능"
                    },
                    {
                        id = "daily_bait",
                        name = "미끼 준비",
                        description = "기본 소모품을 갖춰 다음 낚시에 대비합니다.",
                        requirement = "미끼 5개 사용",
                        progress = "0/5",
                        reward = "미끼 묶음 x1",
                        status = "진행 가능"
                    }
                }
            },
            {
                key = "weekly",
                label = "주간 퀘스트",
                refreshLabel = "매주 월요일 초기화",
                title = "이번 주 집중 의뢰",
                description = "조금 더 긴 호흡으로 진행하는 의뢰입니다. 완료 보상이 큰 편이라 주간 루틴으로 묶기 좋습니다.",
                dialogue = "주간 의뢰는 욕심내도 괜찮네. 한 번만 잘 채우면 보상이 제법 묵직하거든.",
                items = {
                    {
                        id = "weekly_rare",
                        name = "수집가의 납품",
                        description = "희귀 등급 이상 어종을 모아 납품하는 주간 의뢰입니다.",
                        requirement = "희귀 이상 물고기 7마리 납품",
                        progress = "0/7",
                        reward = "12,000 COIN",
                        status = "진행 중"
                    },
                    {
                        id = "weekly_streak",
                        name = "꾸준한 낚시꾼",
                        description = "반복 플레이를 유도하는 누적형 의뢰입니다.",
                        requirement = "낚시 30회 성공",
                        progress = "0/30",
                        reward = "특수 미끼 상자",
                        status = "진행 가능"
                    }
                }
            }
        }
    },
    collectionView = {
        title = "도감",
        sidebar = {
            { label = "일반", progress = "0/0" },
            { label = "희귀", progress = "0/0" },
            { label = "고급", progress = "0/0" },
            { label = "에픽", progress = "0/0" },
            { label = "전설", progress = "0/0" },
            { label = "신화", progress = "0/0" }
        },
        groups = {
            {
                label = "일반",
                progress = "0/0",
                items = {}
            },
            {
                label = "희귀",
                progress = "0/0",
                items = {}
            },
            {
                label = "고급",
                progress = "0/0",
                items = {}
            },
            {
                label = "에픽",
                progress = "0/0",
                items = {}
            },
            {
                label = "전설",
                progress = "0/0",
                items = {}
            },
            {
                label = "신화",
                progress = "0/0",
                items = {}
            }
        }
    },
    shop = {
        balance = 48000,
        currencySuffix = "COIN",
        balanceLabel = "보유 코인",
        balanceMeta = "기본 장비를 먼저 맞추면 낚시가 훨씬 안정적입니다.",
        items = {
            {
                id = "fishingrod",
                name = "입문용 낚싯대",
                category = "starter gear",
                description = "초보 낚시꾼을 위한 기본 낚싯대입니다. 안정적인 장력으로 일반 어종을 상대하기 좋습니다.",
                price = 12500,
                stockLabel = "기본 장비",
                image = "img/fishingrod.webp",
                stats = { "초급 어종 보정", "장착 필요" },
                buttonLabel = "구매하기",
                purchaseMessage = "입문용 낚싯대는 기본 중의 기본이지. 이 정도면 얕은 바다부터 시작하기엔 충분하네."
            },
            {
                id = "fishbait",
                name = "지렁이 미끼 묶음",
                category = "consumable",
                description = "입질 빈도를 높여주는 기본 미끼입니다. 한 번 구매하면 소량 묶음으로 지급됩니다.",
                price = 1200,
                stockLabel = "묶음 x10",
                image = "img/fishbait.webp",
                stats = { "소모품", "묶음 판매" },
                buttonLabel = "구매하기",
                purchaseMessage = "미끼 없이 기다리기만 하면 시간만 버리지. 기본 미끼는 넉넉히 챙겨두는 게 좋네."
            }
        }
    }
}
