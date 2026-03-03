(() => {
const DEFAULT_SELL_CONFIG = {
  balance: 0,
  currencySuffix: "COIN",
  sellAllLabel: "전체 판매",
  items: [],
};

const sellState = {
  balance: DEFAULT_SELL_CONFIG.balance,
  currencySuffix: DEFAULT_SELL_CONFIG.currencySuffix,
  sellAllLabel: DEFAULT_SELL_CONFIG.sellAllLabel,
  items: DEFAULT_SELL_CONFIG.items,
  initialized: false,
  listElement: null,
  balanceElement: null,
  sellAllButton: null,
  onSell: null,
  onSellAll: null,
};

function normalizeNumber(value, fallbackValue) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function formatSellCurrency(value) {
  return `${normalizeNumber(value, 0).toLocaleString("ko-KR")} ${sellState.currencySuffix}`;
}

function createSellStat(text) {
  const el = document.createElement("span");
  el.className = "sell-stat";
  el.textContent = text;
  return el;
}

function createSellItemCard(item) {
  const itemEl = document.createElement("article");
  itemEl.className = "sell-item";

  const visualEl = document.createElement("div");
  visualEl.className = "sell-item-visual";

  const imgEl = document.createElement("img");
  imgEl.className = "sell-item-image";
  imgEl.src = item.image || "";
  imgEl.alt = item.name || "";
  visualEl.appendChild(imgEl);

  const bodyEl = document.createElement("div");
  bodyEl.className = "sell-item-body";

  const toplineEl = document.createElement("div");
  toplineEl.className = "sell-item-topline";

  const nameEl = document.createElement("div");
  nameEl.className = "sell-item-name";
  nameEl.textContent = item.name || "";

  const priceEl = document.createElement("div");
  priceEl.className = "sell-item-price";
  priceEl.textContent = formatSellCurrency(item.price);

  toplineEl.appendChild(nameEl);
  toplineEl.appendChild(priceEl);

  const categoryEl = document.createElement("div");
  categoryEl.className = "sell-item-category";
  categoryEl.textContent = item.category || "";

  const statsEl = document.createElement("div");
  statsEl.className = "sell-item-stats";

  const count = normalizeNumber(item.count, 0);
  const totalPrice = count * normalizeNumber(item.price, 0);

  statsEl.appendChild(createSellStat(`보유 ${count}개`));
  statsEl.appendChild(createSellStat(`합계 ${formatSellCurrency(totalPrice)}`));

  bodyEl.appendChild(toplineEl);
  bodyEl.appendChild(categoryEl);
  bodyEl.appendChild(statsEl);

  const sideEl = document.createElement("div");
  sideEl.className = "sell-item-side";

  const countEl = document.createElement("div");
  countEl.className = "sell-count";
  countEl.textContent = `x${count}`;

  const sellBtnEl = document.createElement("button");
  sellBtnEl.type = "button";
  sellBtnEl.className = "sell-item-button";
  sellBtnEl.dataset.sellItem = item.id;
  sellBtnEl.textContent = item.buttonLabel || "판매하기";

  if (count <= 0) {
    sellBtnEl.disabled = true;
    sellBtnEl.classList.add("is-disabled");
  }

  sideEl.appendChild(countEl);
  sideEl.appendChild(sellBtnEl);

  itemEl.appendChild(visualEl);
  itemEl.appendChild(bodyEl);
  itemEl.appendChild(sideEl);

  return itemEl;
}

function renderSellItems() {
  if (!sellState.listElement) {
    return;
  }

  sellState.listElement.innerHTML = "";

  if (!sellState.items.length) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "sell-empty";
    emptyEl.textContent = "판매할 물고기가 없습니다.";
    sellState.listElement.appendChild(emptyEl);
  } else {
    sellState.items.forEach((item) => {
      sellState.listElement.appendChild(createSellItemCard(item));
    });
  }

  if (sellState.balanceElement) {
    sellState.balanceElement.textContent = formatSellCurrency(sellState.balance);
  }

  if (sellState.sellAllButton) {
    sellState.sellAllButton.textContent = sellState.sellAllLabel;
    sellState.sellAllButton.disabled = sellState.items.length === 0;
  }
}

function getSellItem(itemId) {
  return sellState.items.find((item) => item.id === itemId) || null;
}

function handleSellClick(event) {
  const button = event.target.closest("[data-sell-item]");

  if (!button) {
    return;
  }

  const item = getSellItem(button.dataset.sellItem);

  if (!item || typeof sellState.onSell !== "function") {
    return;
  }

  sellState.onSell(item);
}

function handleSellAllClick() {
  if (typeof sellState.onSellAll !== "function") {
    return;
  }

  sellState.onSellAll(sellState.items);
}

function initSellUi(options) {
  sellState.listElement = options.listElement || null;
  sellState.balanceElement = options.balanceElement || null;
  sellState.sellAllButton = options.sellAllButton || null;
  sellState.onSell = options.onSell || null;
  sellState.onSellAll = options.onSellAll || null;

  if (!sellState.initialized) {
    if (sellState.listElement) {
      sellState.listElement.addEventListener("click", handleSellClick);
    }

    if (sellState.sellAllButton) {
      sellState.sellAllButton.addEventListener("click", handleSellAllClick);
    }

    sellState.initialized = true;
  }

  renderSellItems();
}

function setSellConfig(config) {
  const nextConfig = config && typeof config === "object" ? config : {};

  sellState.balance = normalizeNumber(nextConfig.balance, DEFAULT_SELL_CONFIG.balance);
  sellState.currencySuffix =
    typeof nextConfig.currencySuffix === "string" && nextConfig.currencySuffix
      ? nextConfig.currencySuffix
      : DEFAULT_SELL_CONFIG.currencySuffix;
  sellState.sellAllLabel =
    typeof nextConfig.sellAllLabel === "string" && nextConfig.sellAllLabel
      ? nextConfig.sellAllLabel
      : DEFAULT_SELL_CONFIG.sellAllLabel;
  sellState.items = Array.isArray(nextConfig.items)
    ? nextConfig.items
    : DEFAULT_SELL_CONFIG.items;

  renderSellItems();
}

window.SellUI = {
  init: initSellUi,
  render: renderSellItems,
  setConfig: setSellConfig,
};
})();
