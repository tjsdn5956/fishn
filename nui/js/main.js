const FALLBACK_UI_CONFIG = {
  panelHeader: "낚시 교관 메뉴",
  defaultDialogue:
    "어이, 젊은이. 오늘도 낚시하러 왔나? 필요한 게 있으면 말해보게.",
  backLabel: "뒤로가기",
  menuData: {
    shop: {
      navLabel: "상점",
      section: "낚시 상점",
      title: "기본 장비 상점",
      description:
        "입문용 낚싯대, 미끼, 소모품을 구매할 수 있습니다. 기본 장비를 먼저 갖춰두면 퀘스트와 도감 진행이 훨씬 수월해집니다.",
      tags: ["낚싯대", "미끼", "소모품"],
      actionLabel: "상점 열기",
      actionMessage:
        "필요한 장비부터 챙기게. 장비가 갖춰져야 낚시도 제대로 굴러가지.",
      dialogue:
        "처음이면 상점부터 보는 게 맞네. 장비 없이 물가부터 가봐야 고생만 하지.",
    },
    collection: {
      navLabel: "도감",
      section: "어류 도감",
      title: "도감 진행도",
      description:
        "잡은 물고기는 도감에 자동 등록됩니다. 아직 비어 있는 어종을 확인하고, 희귀 어종 보상이나 수집 보너스를 노려보세요.",
      tags: ["자동 등록", "희귀 어종", "수집 보상"],
      actionLabel: "도감 열기",
      actionMessage:
        "도감은 꾸준함이 전부지. 빠진 어종부터 채워가면 보상이 쌓일 걸세.",
      dialogue:
        "잡은 물고기를 그냥 넘기지 말고 도감도 챙기게. 모아두면 꽤 쏠쏠하지.",
    },
    quest: {
      navLabel: "퀘스트",
      section: "낚시 퀘스트",
      title: "일일 납품 의뢰",
      description:
        "매일 갱신되는 낚시 의뢰를 완료하면 경험치와 보상을 받을 수 있습니다. 일반 어종부터 희귀 어종까지 요구량을 확인하고 진행하세요.",
      tags: ["일일 갱신", "납품 보상", "추가 경험치"],
      actionLabel: "퀘스트 확인",
      actionMessage:
        "오늘 할당량부터 챙기게. 퀘스트만 꾸준히 돌아도 성장 속도가 꽤 빠르지.",
      dialogue:
        "퀘스트는 빼먹지 말게. 장비도 성장도 결국 매일 쌓아야 차이가 나는 법이야.",
    },
    sell: {
      navLabel: "판매",
      section: "물고기 판매",
      title: "판매 목록",
      description:
        "보유 중인 물고기를 판매합니다. 등급이 높을수록 판매 금액이 올라갑니다.",
      tags: ["현금 지급", "즉시 판매", "등급 보정"],
      actionLabel: "전체 판매",
      actionMessage:
        "좋은 어획량이군. 제대로 값을 쳐주지.",
      dialogue:
        "잡아온 물고기, 내가 제값에 사줄 테니 한번 내놔보게.",
    },
  },
  shop: {
    balance: 48000,
    currencySuffix: "COIN",
    balanceLabel: "보유 코인",
    balanceMeta: "기본 장비를 먼저 맞추면 낚시가 훨씬 안정적입니다.",
    items: [],
  },
  sellView: {
    balance: 0,
    currencySuffix: "COIN",
    balanceLabel: "보유 코인",
    balanceMeta: "등급이 높은 물고기일수록 단가가 높습니다.",
    sellAllLabel: "전체 판매",
    items: [],
  },
  questView: {
    tabs: [
      {
        key: "daily",
        label: "일일 퀘스트",
        refreshLabel: "매일 00:00 초기화",
        title: "오늘의 납품 의뢰",
        description:
          "매일 가볍게 진행할 수 있는 반복 의뢰입니다. 꾸준히 채우면 코인과 성장 재화를 안정적으로 모을 수 있습니다.",
        dialogue:
          "하루치 할당량은 가볍게 비워두는 게 좋지. 작은 적립이 결국 큰 차이를 만든다네.",
        items: [
          {
            id: "daily_common",
            name: "손맛 익히기",
            description: "일반 등급 물고기를 납품해 기본 보상을 챙기세요.",
            requirement: "일반 물고기 10마리 납품",
            progress: "0/10",
            reward: "2,000 COIN",
            status: "진행 가능",
          },
          {
            id: "daily_bait",
            name: "미끼 준비",
            description: "기본 소모품을 갖춰 다음 낚시에 대비합니다.",
            requirement: "미끼 5개 사용",
            progress: "0/5",
            reward: "미끼 묶음 x1",
            status: "진행 가능",
          },
        ],
      },
      {
        key: "weekly",
        label: "주간 퀘스트",
        refreshLabel: "매주 월요일 초기화",
        title: "이번 주 집중 의뢰",
        description:
          "조금 더 긴 호흡으로 진행하는 의뢰입니다. 완료 보상이 큰 편이라 주간 루틴으로 묶기 좋습니다.",
        dialogue:
          "주간 의뢰는 욕심내도 괜찮네. 한 번만 잘 채우면 보상이 제법 묵직하거든.",
        items: [
          {
            id: "weekly_rare",
            name: "수집가의 납품",
            description: "희귀 등급 이상 어종을 모아 납품하는 주간 의뢰입니다.",
            requirement: "희귀 이상 물고기 7마리 납품",
            progress: "0/7",
            reward: "12,000 COIN",
            status: "진행 중",
          },
          {
            id: "weekly_streak",
            name: "꾸준한 낚시꾼",
            description: "반복 플레이를 유도하는 누적형 의뢰입니다.",
            requirement: "낚시 30회 성공",
            progress: "0/30",
            reward: "특수 미끼 상자",
            status: "진행 가능",
          },
        ],
      },
    ],
  },
};

const panelHeaderElement = document.getElementById("panel-header");
const panelSectionElement = document.getElementById("panel-section");
const cardTitleElement = document.getElementById("card-title");
const cardDescElement = document.getElementById("card-desc");
const tagGroupElement = document.getElementById("tag-group");
const actionButtonElement = document.getElementById("action-button");
const dialogueLineElement = document.getElementById("dialogue-line");
const infoPanelElement = document.getElementById("info-panel");
const infoCardElement = document.getElementById("info-card");
const menuShellElement = document.getElementById("menu-shell");
const collectionScreenElement = document.getElementById("collection-screen");
const shopLayoutElement = document.getElementById("shop-layout");
const questLayoutElement = document.getElementById("quest-layout");
const questTabsElement = document.getElementById("quest-tabs");
const questSummaryTitleElement = document.getElementById("quest-summary-title");
const questSummaryResetElement = document.getElementById("quest-summary-reset");
const questSummaryDescElement = document.getElementById("quest-summary-desc");
const questListElement = document.getElementById("quest-list");
const shopListElement = document.getElementById("shop-list");
const shopBalanceLabelElement = document.getElementById("shop-balance-label");
const shopBalanceValueElement = document.getElementById("shop-balance-value");
const shopBalanceMetaElement = document.getElementById("shop-balance-meta");
const sellLayoutElement = document.getElementById("sell-layout");
const sellListElement = document.getElementById("sell-list");
const sellBalanceLabelElement = document.getElementById("sell-balance-label");
const sellBalanceValueElement = document.getElementById("sell-balance-value");
const sellBalanceMetaElement = document.getElementById("sell-balance-meta");
const sellAllButtonElement = document.getElementById("sell-all-button");
const collectionTitleElement = document.getElementById("collection-title");
const collectionSidebarElement = document.getElementById("collection-sidebar");
const collectionGroupsElement = document.getElementById("collection-groups");
const collectionFeaturedImageElement = document.getElementById("collection-featured-image");
const collectionPreviewEmptyElement = document.getElementById("collection-preview-empty");
const collectionFeaturedNameElement = document.getElementById("collection-featured-name");
const collectionFeaturedRegionElement = document.getElementById("collection-featured-region");
const collectionFeaturedDescriptionElement = document.getElementById("collection-featured-description");
const headLabelOverlayElement = document.getElementById("head-label-overlay");
const headLabelRoleElement = document.getElementById("head-label-role");
const headLabelNameElement = document.getElementById("head-label-name");
const npcRoleElement = document.getElementById("npc-role");
const npcNameElement = document.getElementById("npc-name");
const backButtonElement = document.querySelector('.menu-button[data-menu="back"]');
const menuButtons = document.querySelectorAll(".menu-button");

let activeMenu = null;
let uiConfig = FALLBACK_UI_CONFIG;
let activeQuestTab = null;

function getTextValue(value, fallbackValue) {
  return typeof value === "string" && value ? value : fallbackValue;
}

function getCurrentMenu(menuKey) {
  const fallbackMenu = FALLBACK_UI_CONFIG.menuData[menuKey];
  const configuredMenu =
    uiConfig &&
    uiConfig.menuData &&
    typeof uiConfig.menuData === "object" &&
    uiConfig.menuData[menuKey]
      ? uiConfig.menuData[menuKey]
      : null;

  if (!fallbackMenu && !configuredMenu) {
    return null;
  }

  return {
    ...fallbackMenu,
    ...configuredMenu,
    tags: Array.isArray(configuredMenu && configuredMenu.tags)
      ? configuredMenu.tags
      : Array.isArray(fallbackMenu && fallbackMenu.tags)
        ? fallbackMenu.tags
        : [],
  };
}

function getCurrentShopConfig() {
  const configuredShop =
    uiConfig && uiConfig.shop && typeof uiConfig.shop === "object"
      ? uiConfig.shop
      : {};
  const fallbackShop = FALLBACK_UI_CONFIG.shop;

  return {
    ...fallbackShop,
    ...configuredShop,
    items: Array.isArray(configuredShop.items)
      ? configuredShop.items
      : fallbackShop.items,
  };
}

function getCurrentSellConfig() {
  const configuredSell =
    uiConfig && uiConfig.sellView && typeof uiConfig.sellView === "object"
      ? uiConfig.sellView
      : {};
  const fallbackSell = FALLBACK_UI_CONFIG.sellView;
  const shopConfig = getCurrentShopConfig();

  return {
    ...fallbackSell,
    ...configuredSell,
    balance:
      configuredSell.balance !== undefined
        ? configuredSell.balance
        : shopConfig.balance,
    currencySuffix:
      configuredSell.currencySuffix || shopConfig.currencySuffix || fallbackSell.currencySuffix,
    items: Array.isArray(configuredSell.items)
      ? configuredSell.items
      : fallbackSell.items,
  };
}

function getCurrentQuestConfig() {
  const configuredQuest =
    uiConfig && uiConfig.questView && typeof uiConfig.questView === "object"
      ? uiConfig.questView
      : {};
  const fallbackQuest = FALLBACK_UI_CONFIG.questView;

  return {
    ...fallbackQuest,
    ...configuredQuest,
    tabs: Array.isArray(configuredQuest.tabs)
      ? configuredQuest.tabs
      : fallbackQuest.tabs,
  };
}

function getDefaultDialogue() {
  return getTextValue(
    uiConfig && uiConfig.defaultDialogue,
    FALLBACK_UI_CONFIG.defaultDialogue
  );
}

function handleShopPurchase(item) {
  setDialogue(item.purchaseMessage || getDefaultDialogue());
  postNui("selectAction", {
    menu: "shop",
    itemId: item.id,
  });
}

function handleSellFish(item) {
  setDialogue("좋은 물고기네. 제값에 사줌세.");
  postNui("sellFish", {
    itemId: item.id,
  });
}

function handleSellAllFish() {
  setDialogue("한꺼번에 다 팔겠다는 게지? 좋아, 제값에 사주마.");
  postNui("sellFish", {
    sellAll: true,
  });
}

function postNui(eventName, payload = {}) {
  if (typeof GetParentResourceName !== "function") {
    return Promise.resolve();
  }

  return fetch(`https://${GetParentResourceName()}/${eventName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function setVisible(visible) {
  menuShellElement.classList.toggle("ui-hidden", !visible);
}

function setDialogueVisible(visible) {
  dialogueLineElement.classList.toggle("is-hidden", !visible);
}

function setHeadLabelVisible(visible) {
  headLabelOverlayElement.classList.toggle("is-hidden", !visible);
}

function setHeadLabelPosition(x, y) {
  headLabelOverlayElement.style.left = `${x * 100}%`;
  headLabelOverlayElement.style.top = `${y * 100}%`;
}

function setHeadLabel(data) {
  const visible = Boolean(data.visible);

  if (!visible) {
    setHeadLabelVisible(false);
    return;
  }

  if (data.npcRole) {
    headLabelRoleElement.textContent = data.npcRole;
  }

  if (data.npcName) {
    headLabelNameElement.textContent = data.npcName;
  }

  setHeadLabelPosition(Number(data.x) || 0, Number(data.y) || 0);
  setHeadLabelVisible(true);
}

function applyNpcLabels(data) {
  if (data.npcRole) {
    npcRoleElement.textContent = data.npcRole;
  }

  if (data.npcName) {
    npcNameElement.textContent = data.npcName;
  }
}

function createQuestChip(className, text) {
  const chipElement = document.createElement("span");
  chipElement.className = className;
  chipElement.textContent = text;
  return chipElement;
}

function renderQuest(selectedTabKey = activeQuestTab, updateDialogue = false) {
  if (
    !questLayoutElement ||
    !questTabsElement ||
    !questSummaryTitleElement ||
    !questSummaryResetElement ||
    !questSummaryDescElement ||
    !questListElement
  ) {
    return;
  }

  const questConfig = getCurrentQuestConfig();
  const tabs = Array.isArray(questConfig.tabs)
    ? questConfig.tabs.filter((tab) => tab && typeof tab === "object")
    : [];
  const activeTab =
    tabs.find((tab) => tab.key === selectedTabKey) || tabs[0] || null;

  activeQuestTab = activeTab ? activeTab.key : null;

  questTabsElement.innerHTML = "";
  questListElement.innerHTML = "";

  if (!activeTab) {
    questSummaryTitleElement.textContent = "퀘스트";
    questSummaryResetElement.textContent = "";
    questSummaryDescElement.textContent = "표시할 퀘스트가 없습니다.";

    const emptyElement = document.createElement("div");
    emptyElement.className = "quest-empty";
    emptyElement.textContent = "등록된 퀘스트가 없습니다.";
    questListElement.appendChild(emptyElement);
    return;
  }

  tabs.forEach((tab) => {
    const tabButton = document.createElement("button");
    tabButton.type = "button";
    tabButton.className = "quest-tab-button";
    tabButton.textContent = getTextValue(tab.label, "퀘스트");
    tabButton.classList.toggle("active", tab.key === activeQuestTab);
    tabButton.addEventListener("click", () => {
      renderQuest(tab.key, true);
    });
    questTabsElement.appendChild(tabButton);
  });

  questSummaryTitleElement.textContent = getTextValue(activeTab.title, "퀘스트");
  questSummaryResetElement.textContent = getTextValue(activeTab.refreshLabel, "");
  questSummaryDescElement.textContent = getTextValue(
    activeTab.description,
    "표시할 퀘스트가 없습니다."
  );

  if (updateDialogue && activeMenu === "quest" && activeTab.dialogue) {
    setDialogue(activeTab.dialogue);
  }

  const items = Array.isArray(activeTab.items) ? activeTab.items : [];

  if (!items.length) {
    const emptyElement = document.createElement("div");
    emptyElement.className = "quest-empty";
    emptyElement.textContent = "등록된 퀘스트가 없습니다.";
    questListElement.appendChild(emptyElement);
    return;
  }

  items.forEach((item) => {
    const questItemElement = document.createElement("article");
    questItemElement.className = "quest-item";

    const questBodyElement = document.createElement("div");
    questBodyElement.className = "quest-item-body";

    const questToplineElement = document.createElement("div");
    questToplineElement.className = "quest-item-topline";

    const questNameElement = document.createElement("div");
    questNameElement.className = "quest-item-name";
    questNameElement.textContent = getTextValue(item.name, "퀘스트");

    const questProgressElement = document.createElement("div");
    questProgressElement.className = "quest-item-progress";
    questProgressElement.textContent = getTextValue(item.progress, "0/0");

    questToplineElement.appendChild(questNameElement);
    questToplineElement.appendChild(questProgressElement);

    const questDescElement = document.createElement("div");
    questDescElement.className = "quest-item-desc";
    questDescElement.textContent = getTextValue(
      item.description,
      "퀘스트 설명이 없습니다."
    );

    const questMetaElement = document.createElement("div");
    questMetaElement.className = "quest-item-meta";
    questMetaElement.appendChild(
      createQuestChip(
        "quest-chip",
        getTextValue(item.requirement, "조건 정보 없음")
      )
    );
    questMetaElement.appendChild(
      createQuestChip("quest-chip is-reward", getTextValue(item.reward, "보상 없음"))
    );

    questBodyElement.appendChild(questToplineElement);
    questBodyElement.appendChild(questDescElement);
    questBodyElement.appendChild(questMetaElement);

    const questSideElement = document.createElement("div");
    questSideElement.className = "quest-item-side";

    const questStatusElement = document.createElement("div");
    questStatusElement.className = "quest-status";
    questStatusElement.textContent = getTextValue(item.status, "대기 중");

    const questRewardElement = document.createElement("div");
    questRewardElement.className = "quest-reward";
    questRewardElement.textContent = getTextValue(item.reward, "보상 없음");

    questSideElement.appendChild(questStatusElement);
    questSideElement.appendChild(questRewardElement);

    questItemElement.appendChild(questBodyElement);
    questItemElement.appendChild(questSideElement);
    questListElement.appendChild(questItemElement);
  });
}

function setContentMode(menuKey) {
  const isShopMenu = menuKey === "shop";
  const isCollectionMenu = menuKey === "collection";
  const isQuestMenu = menuKey === "quest";
  const isSellMenu = menuKey === "sell";

  infoPanelElement.classList.toggle("is-hidden", isCollectionMenu);
  collectionScreenElement.classList.toggle("is-hidden", !isCollectionMenu);
  shopLayoutElement.classList.toggle("is-hidden", !isShopMenu);
  questLayoutElement.classList.toggle("is-hidden", !isQuestMenu);
  sellLayoutElement.classList.toggle("is-hidden", !isSellMenu);
  infoCardElement.classList.toggle(
    "is-hidden",
    isShopMenu || isCollectionMenu || isQuestMenu || isSellMenu
  );
  setDialogueVisible(true);

  if (isShopMenu && window.ShopUI) {
    window.ShopUI.render();
  }

  if (isSellMenu && window.SellUI) {
    window.SellUI.render();
  }

  if (isQuestMenu) {
    renderQuest();
  }

  if (isCollectionMenu && window.CollectionUI) {
    window.CollectionUI.render();
  }
}

function resetMenuSelection() {
  activeMenu = null;
  infoPanelElement.classList.add("is-hidden");
  collectionScreenElement.classList.add("is-hidden");
  shopLayoutElement.classList.add("is-hidden");
  questLayoutElement.classList.add("is-hidden");
  sellLayoutElement.classList.add("is-hidden");
  infoCardElement.classList.add("is-hidden");
  activeQuestTab = null;
  setDialogueVisible(true);
  setDialogue(getDefaultDialogue());

  menuButtons.forEach((button) => {
    button.classList.remove("active");
  });
}

function setDialogue(message) {
  dialogueLineElement.style.opacity = "0";

  window.setTimeout(() => {
    dialogueLineElement.textContent = message || "";
    dialogueLineElement.style.opacity = "1";
  }, 150);
}

function renderTags(tags) {
  tagGroupElement.innerHTML = "";

  (Array.isArray(tags) ? tags : []).forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "info-tag";
    tagElement.textContent = tag;
    tagGroupElement.appendChild(tagElement);
  });
}

function renderMenu(menuKey) {
  const menu = getCurrentMenu(menuKey);

  if (!menu) {
    return;
  }

  activeMenu = menuKey;
  setContentMode(menuKey);
  setDialogue(menu.dialogue);

  if (menuKey !== "collection") {
    panelSectionElement.textContent = menu.section;
  }

  if (menuKey !== "collection" && menuKey !== "quest") {
    cardTitleElement.textContent = menu.title;
    cardDescElement.textContent = menu.description;
    actionButtonElement.textContent = menu.actionLabel;
    renderTags(menu.tags);
  }

  menuButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.menu === menuKey);
  });
}

function applyUiConfig(nextConfig) {
  uiConfig = nextConfig && typeof nextConfig === "object" ? nextConfig : FALLBACK_UI_CONFIG;

  if (panelHeaderElement) {
    panelHeaderElement.textContent = getTextValue(
      uiConfig.panelHeader,
      FALLBACK_UI_CONFIG.panelHeader
    );
  }

  if (backButtonElement) {
    backButtonElement.textContent = getTextValue(
      uiConfig.backLabel,
      FALLBACK_UI_CONFIG.backLabel
    );
  }

  if (shopBalanceLabelElement || shopBalanceMetaElement || window.ShopUI) {
    const shopConfig = getCurrentShopConfig();

    if (shopBalanceLabelElement) {
      shopBalanceLabelElement.textContent = getTextValue(
        shopConfig.balanceLabel,
        FALLBACK_UI_CONFIG.shop.balanceLabel
      );
    }

    if (shopBalanceMetaElement) {
      shopBalanceMetaElement.textContent = getTextValue(
        shopConfig.balanceMeta,
        FALLBACK_UI_CONFIG.shop.balanceMeta
      );
    }

    if (window.ShopUI) {
      window.ShopUI.setConfig(shopConfig);
    }
  }

  if (window.CollectionUI) {
    window.CollectionUI.setConfig(uiConfig.collectionView);
  }

  if (sellBalanceLabelElement || sellBalanceMetaElement || window.SellUI) {
    const sellConfig = getCurrentSellConfig();

    if (sellBalanceLabelElement) {
      sellBalanceLabelElement.textContent = getTextValue(
        sellConfig.balanceLabel,
        FALLBACK_UI_CONFIG.sellView.balanceLabel
      );
    }

    if (sellBalanceMetaElement) {
      sellBalanceMetaElement.textContent = getTextValue(
        sellConfig.balanceMeta,
        FALLBACK_UI_CONFIG.sellView.balanceMeta
      );
    }

    if (window.SellUI) {
      window.SellUI.setConfig(sellConfig);
    }
  }

  menuButtons.forEach((button) => {
    const menuKey = button.dataset.menu;

    if (menuKey === "back") {
      return;
    }

    const menu = getCurrentMenu(menuKey);

    if (menu) {
      button.textContent = getTextValue(menu.navLabel, button.textContent);
    }
  });

  if (activeMenu) {
    renderMenu(activeMenu);
    return;
  }

  setDialogue(getDefaultDialogue());
}

function closeUi() {
  postNui("close");
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const menuKey = button.dataset.menu;

    if (menuKey === "back") {
      closeUi();
      return;
    }

    if (activeMenu === menuKey) {
      resetMenuSelection();
      return;
    }

    renderMenu(menuKey);
  });
});

actionButtonElement.addEventListener("click", () => {
  if (!activeMenu || activeMenu === "shop") {
    return;
  }

  const menu = getCurrentMenu(activeMenu);

  if (!menu) {
    return;
  }

  setDialogue(menu.actionMessage);
  postNui("selectAction", { menu: activeMenu });
});

window.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.action === "syncUiConfig") {
    applyNpcLabels(data);
    applyUiConfig(data.uiConfig);
    return;
  }

  if (data.action === "setHeadLabel") {
    setHeadLabel(data);
    return;
  }

  applyNpcLabels(data);

  if (data.action === "toggle") {
    setVisible(Boolean(data.visible));

    if (data.visible) {
      resetMenuSelection();
    }
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeUi();
  }
});

if (window.ShopUI) {
  window.ShopUI.init({
    catalogElement: shopListElement,
    balanceElement: shopBalanceValueElement,
    onPurchase: handleShopPurchase,
  });
}

if (window.SellUI) {
  window.SellUI.init({
    listElement: sellListElement,
    balanceElement: sellBalanceValueElement,
    sellAllButton: sellAllButtonElement,
    onSell: handleSellFish,
    onSellAll: handleSellAllFish,
  });
}

if (window.CollectionUI) {
  window.CollectionUI.init({
    rootElement: collectionScreenElement,
    titleElement: collectionTitleElement,
    sidebarElement: collectionSidebarElement,
    groupsElement: collectionGroupsElement,
    previewImageElement: collectionFeaturedImageElement,
    previewEmptyElement: collectionPreviewEmptyElement,
    featuredNameElement: collectionFeaturedNameElement,
    featuredRegionElement: collectionFeaturedRegionElement,
    featuredDescriptionElement: collectionFeaturedDescriptionElement,
  });
}

applyUiConfig(FALLBACK_UI_CONFIG);
resetMenuSelection();
setVisible(false);
setHeadLabelVisible(false);
