(() => {
const DEFAULT_SHOP_CONFIG = {
  balance: 48000,
  currencySuffix: "COIN",
  items: [
    {
      id: "fishingrod",
      name: "입문용 낚싯대",
      category: "starter gear",
      description:
        "초보 낚시꾼을 위한 기본 낚싯대입니다. 안정적인 장력으로 일반 어종을 상대하기 좋습니다.",
      price: 12500,
      stockLabel: "기본 장비",
      image: "img/fishingrod.webp",
      stats: ["내구도 +10", "초급 어종 보정", "장착 필요"],
      buttonLabel: "구매하기",
      purchaseMessage:
        "입문용 낚싯대는 기본 중의 기본이지. 이 정도면 얕은 바다부터 시작하기엔 충분하네.",
    },
    {
      id: "fishbait",
      name: "지렁이 미끼 묶음",
      category: "consumable",
      description:
        "입질 빈도를 높여주는 기본 미끼입니다. 한 번 구매하면 소량 묶음으로 지급됩니다.",
      price: 1200,
      stockLabel: "묶음 x10",
      image: "img/fishbait.webp",
      stats: ["입질 확률 +8%", "소모품", "묶음 판매"],
      buttonLabel: "구매하기",
      purchaseMessage:
        "미끼 없이 기다리기만 하면 시간만 버리지. 기본 미끼는 넉넉히 챙겨두는 게 좋네.",
    },
  ],
};

const shopState = {
  balance: DEFAULT_SHOP_CONFIG.balance,
  currencySuffix: DEFAULT_SHOP_CONFIG.currencySuffix,
  items: DEFAULT_SHOP_CONFIG.items,
  initialized: false,
  catalogElement: null,
  balanceElement: null,
  onPurchase: null,
};

function normalizeNumber(value, fallbackValue) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function formatShopCurrency(value) {
  return `${normalizeNumber(value, 0).toLocaleString("ko-KR")} ${shopState.currencySuffix}`;
}

function createShopStat(stat) {
  const statElement = document.createElement("span");
  statElement.className = "shop-stat";
  statElement.textContent = stat;
  return statElement;
}

function createShopItemCard(item) {
  const itemElement = document.createElement("article");
  itemElement.className = "shop-item";

  const visualElement = document.createElement("div");
  visualElement.className = "shop-item-visual";

  const imageElement = document.createElement("img");
  imageElement.className = "shop-item-image";
  imageElement.src = item.image || "";
  imageElement.alt = item.name || "";
  visualElement.appendChild(imageElement);

  const bodyElement = document.createElement("div");
  bodyElement.className = "shop-item-body";

  const topLineElement = document.createElement("div");
  topLineElement.className = "shop-item-topline";

  const nameElement = document.createElement("div");
  nameElement.className = "shop-item-name";
  nameElement.textContent = item.name || "";

  const priceElement = document.createElement("div");
  priceElement.className = "shop-item-price";
  priceElement.textContent = formatShopCurrency(item.price);

  topLineElement.appendChild(nameElement);
  topLineElement.appendChild(priceElement);

  const categoryElement = document.createElement("div");
  categoryElement.className = "shop-item-category";
  categoryElement.textContent = item.category || "";

  const descElement = document.createElement("div");
  descElement.className = "shop-item-desc";
  descElement.textContent = item.description || "";

  const statsElement = document.createElement("div");
  statsElement.className = "shop-item-stats";
  (Array.isArray(item.stats) ? item.stats : []).forEach((stat) => {
    statsElement.appendChild(createShopStat(stat));
  });

  bodyElement.appendChild(topLineElement);
  bodyElement.appendChild(categoryElement);
  bodyElement.appendChild(descElement);
  bodyElement.appendChild(statsElement);

  const sideElement = document.createElement("div");
  sideElement.className = "shop-item-side";

  const stockElement = document.createElement("div");
  stockElement.className = "shop-stock";
  stockElement.textContent = item.stockLabel || "";

  const buyButtonElement = document.createElement("button");
  buyButtonElement.type = "button";
  buyButtonElement.className = "shop-buy-button";
  buyButtonElement.dataset.shopItem = item.id;
  buyButtonElement.textContent = item.buttonLabel || "구매하기";

  sideElement.appendChild(stockElement);
  sideElement.appendChild(buyButtonElement);

  itemElement.appendChild(visualElement);
  itemElement.appendChild(bodyElement);
  itemElement.appendChild(sideElement);

  return itemElement;
}

function renderShopItems() {
  if (!shopState.catalogElement) {
    return;
  }

  shopState.catalogElement.innerHTML = "";

  shopState.items.forEach((item) => {
    shopState.catalogElement.appendChild(createShopItemCard(item));
  });

  if (shopState.balanceElement) {
    shopState.balanceElement.textContent = formatShopCurrency(shopState.balance);
  }
}

function getShopItem(itemId) {
  return shopState.items.find((item) => item.id === itemId) || null;
}

function handleShopClick(event) {
  const button = event.target.closest("[data-shop-item]");

  if (!button) {
    return;
  }

  const item = getShopItem(button.dataset.shopItem);

  if (!item || typeof shopState.onPurchase !== "function") {
    return;
  }

  shopState.onPurchase(item);
}

function initShopUi(options) {
  shopState.catalogElement = options.catalogElement || null;
  shopState.balanceElement = options.balanceElement || null;
  shopState.onPurchase = options.onPurchase || null;

  if (!shopState.initialized && shopState.catalogElement) {
    shopState.catalogElement.addEventListener("click", handleShopClick);
    shopState.initialized = true;
  }

  renderShopItems();
}

function setShopConfig(config) {
  const nextConfig = config && typeof config === "object" ? config : {};

  shopState.balance = normalizeNumber(nextConfig.balance, DEFAULT_SHOP_CONFIG.balance);
  shopState.currencySuffix =
    typeof nextConfig.currencySuffix === "string" && nextConfig.currencySuffix
      ? nextConfig.currencySuffix
      : DEFAULT_SHOP_CONFIG.currencySuffix;
  shopState.items = Array.isArray(nextConfig.items)
    ? nextConfig.items
    : DEFAULT_SHOP_CONFIG.items;

  renderShopItems();
}

window.ShopUI = {
  init: initShopUi,
  render: renderShopItems,
  getItem: getShopItem,
  setConfig: setShopConfig,
};
})();
