(() => {
const DEFAULT_COLLECTION_CONFIG = {
  title: "도감",
  groups: [
    { label: "일반", progress: "0/0", items: [] },
    { label: "희귀", progress: "0/0", items: [] },
    { label: "고급", progress: "0/0", items: [] },
    { label: "에픽", progress: "0/0", items: [] },
    { label: "전설", progress: "0/0", items: [] },
    { label: "신화", progress: "0/0", items: [] },
  ],
};

const collectionState = {
  config: DEFAULT_COLLECTION_CONFIG,
  initialized: false,
  selectedGroupLabel: null,
  selectedFishId: null,
  rootElement: null,
  titleElement: null,
  sidebarElement: null,
  groupsElement: null,
  previewImageElement: null,
  previewEmptyElement: null,
  featuredNameElement: null,
  featuredRegionElement: null,
  featuredDescriptionElement: null,
};

function getSafeArray(value, fallbackValue) {
  return Array.isArray(value) && value.length ? value : fallbackValue;
}

function getSidebarEntries() {
  if (Array.isArray(collectionState.config.sidebar) && collectionState.config.sidebar.length) {
    return collectionState.config.sidebar;
  }

  return collectionState.config.groups.map((group) => ({
    label: group.label,
    progress: group.progress,
  }));
}

function getVisibleGroups() {
  if (!Array.isArray(collectionState.config.groups) || !collectionState.config.groups.length) {
    return [];
  }

  if (!collectionState.selectedGroupLabel) {
    return [collectionState.config.groups[0]];
  }

  const activeGroup = collectionState.config.groups.find(
    (group) => group.label === collectionState.selectedGroupLabel
  );

  return activeGroup ? [activeGroup] : [collectionState.config.groups[0]];
}

function getAllFishItems() {
  const items = [];

  getVisibleGroups().forEach((group) => {
    if (!Array.isArray(group.items)) {
      return;
    }

    group.items.forEach((item) => {
      items.push(item);
    });
  });

  return items;
}

function getFishItem(itemId) {
  return getAllFishItems().find((item) => item.id === itemId) || null;
}

function getActiveFishItem() {
  const selectedItem = getFishItem(collectionState.selectedFishId);

  if (selectedItem) {
    return selectedItem;
  }

  const firstItem = getAllFishItems()[0] || null;

  if (firstItem) {
    collectionState.selectedFishId = firstItem.id;
  }

  return firstItem;
}

function renderHeader() {
  if (!collectionState.titleElement) {
    return;
  }

  collectionState.titleElement.textContent = collectionState.config.title || "";
}

function renderSidebar() {
  if (!collectionState.sidebarElement) {
    return;
  }

  collectionState.sidebarElement.innerHTML = "";

  getSidebarEntries().forEach((entry) => {
    const itemElement = document.createElement("button");
    itemElement.type = "button";
    itemElement.className = "collection-side-item";
    itemElement.dataset.collectionGroup = entry.label || "";

    if ((entry.label || "") === collectionState.selectedGroupLabel) {
      itemElement.classList.add("is-active");
    }

    const markerElement = document.createElement("span");
    markerElement.className = "collection-side-marker";

    const labelElement = document.createElement("span");
    labelElement.className = "collection-side-label";
    labelElement.textContent = entry.label || "";

    const progressElement = document.createElement("span");
    progressElement.className = "collection-side-progress";
    progressElement.textContent = entry.progress || "";

    itemElement.appendChild(markerElement);
    itemElement.appendChild(labelElement);
    itemElement.appendChild(progressElement);
    collectionState.sidebarElement.appendChild(itemElement);
  });
}

function createFishButton(item) {
  const buttonElement = document.createElement("button");
  buttonElement.type = "button";
  buttonElement.className = "collection-fish-button";
  buttonElement.dataset.collectionFish = item.id;
  buttonElement.title = item.name || item.id || "";

  if (item.id === collectionState.selectedFishId) {
    buttonElement.classList.add("is-active");
  }

  if (typeof item.image === "string" && item.image) {
    const imageElement = document.createElement("img");
    imageElement.className = "collection-fish-thumb";
    imageElement.src = item.image;
    imageElement.alt = item.name || "";
    buttonElement.appendChild(imageElement);
  } else {
    const labelElement = document.createElement("span");
    labelElement.className = "collection-fish-text";
    labelElement.textContent =
      item.shortLabel ||
      item.name ||
      "사진";
    buttonElement.appendChild(labelElement);
  }

  return buttonElement;
}

function renderGroups() {
  if (!collectionState.groupsElement) {
    return;
  }

  collectionState.groupsElement.innerHTML = "";

  getVisibleGroups().forEach((group) => {
    const groupElement = document.createElement("section");
    groupElement.className = "collection-group";

    const headerElement = document.createElement("div");
    headerElement.className = "collection-group-header";

    const titleElement = document.createElement("span");
    titleElement.className = "collection-group-title";
    titleElement.textContent = group.label || "";

    const progressElement = document.createElement("span");
    progressElement.className = "collection-group-progress";
    progressElement.textContent = group.progress || "";

    headerElement.appendChild(titleElement);
    headerElement.appendChild(progressElement);

    const rowElement = document.createElement("div");
    rowElement.className = "collection-group-row";

    const groupItems = Array.isArray(group.items) ? group.items : [];

    if (groupItems.length) {
      groupItems.forEach((item) => {
        rowElement.appendChild(createFishButton(item));
      });
    } else {
      const emptyElement = document.createElement("div");
      emptyElement.className = "collection-group-empty";
      emptyElement.textContent = "등록된 사진이 없습니다.";
      rowElement.appendChild(emptyElement);
    }

    groupElement.appendChild(headerElement);
    groupElement.appendChild(rowElement);
    collectionState.groupsElement.appendChild(groupElement);
  });
}

function renderPreview() {
  const activeItem = getActiveFishItem();

  if (!activeItem) {
    if (collectionState.featuredNameElement) {
      collectionState.featuredNameElement.textContent = "도감 미리보기";
    }

    if (collectionState.featuredRegionElement) {
      const activeGroupLabel = collectionState.selectedGroupLabel || "선택한 등급";
      collectionState.featuredRegionElement.textContent = `${activeGroupLabel} 사진을 등록하면 여기에 표시됩니다.`;
    }

    if (collectionState.featuredDescriptionElement) {
      collectionState.featuredDescriptionElement.textContent =
        "현재 등록된 물고기 사진이 없습니다.";
    }

    if (collectionState.previewImageElement) {
      collectionState.previewImageElement.classList.add("is-hidden");
      collectionState.previewImageElement.removeAttribute("src");
      collectionState.previewImageElement.removeAttribute("alt");
    }

    if (collectionState.previewEmptyElement) {
      collectionState.previewEmptyElement.classList.remove("is-hidden");
    }

    return;
  }

  if (collectionState.featuredNameElement) {
    collectionState.featuredNameElement.textContent = activeItem.name || "도감 미리보기";
  }

  if (collectionState.featuredRegionElement) {
    collectionState.featuredRegionElement.textContent = activeItem.region || "";
  }

  if (collectionState.featuredDescriptionElement) {
    collectionState.featuredDescriptionElement.textContent =
      activeItem.description || "등록된 어종 설명이 없습니다.";
  }

  if (
    collectionState.previewImageElement &&
    typeof activeItem.image === "string" &&
    activeItem.image
  ) {
    collectionState.previewImageElement.src = activeItem.image;
    collectionState.previewImageElement.alt = activeItem.name || "";
    collectionState.previewImageElement.classList.remove("is-hidden");

    if (collectionState.previewEmptyElement) {
      collectionState.previewEmptyElement.classList.add("is-hidden");
    }

    return;
  }

  if (collectionState.previewImageElement) {
    collectionState.previewImageElement.classList.add("is-hidden");
    collectionState.previewImageElement.removeAttribute("src");
    collectionState.previewImageElement.removeAttribute("alt");
  }

  if (collectionState.previewEmptyElement) {
    collectionState.previewEmptyElement.classList.remove("is-hidden");
  }
}

function renderCollection() {
  renderHeader();
  renderSidebar();
  renderGroups();
  renderPreview();
}

function ensureSelectedGroup() {
  if (!Array.isArray(collectionState.config.groups) || !collectionState.config.groups.length) {
    collectionState.selectedGroupLabel = null;
    return;
  }

  const existingGroup = collectionState.config.groups.find(
    (group) => group.label === collectionState.selectedGroupLabel
  );

  if (existingGroup) {
    return;
  }

  collectionState.selectedGroupLabel = collectionState.config.groups[0].label || null;
}

function ensureSelectedFish() {
  ensureSelectedGroup();

  const existingItem = getFishItem(collectionState.selectedFishId);

  if (existingItem) {
    return;
  }

  const firstItem = getAllFishItems()[0] || null;
  collectionState.selectedFishId = firstItem ? firstItem.id : null;
}

function setCollectionConfig(config) {
  const nextConfig = config && typeof config === "object" ? config : {};

  collectionState.config = {
    ...DEFAULT_COLLECTION_CONFIG,
    ...nextConfig,
    groups: getSafeArray(nextConfig.groups, DEFAULT_COLLECTION_CONFIG.groups),
  };

  if (Array.isArray(nextConfig.sidebar) && nextConfig.sidebar.length) {
    collectionState.config.sidebar = nextConfig.sidebar;
  } else {
    delete collectionState.config.sidebar;
  }

  ensureSelectedGroup();
  ensureSelectedFish();
  renderCollection();
}

function handleCollectionClick(event) {
  const groupElement = event.target.closest("[data-collection-group]");

  if (groupElement) {
    const nextGroupLabel = groupElement.dataset.collectionGroup || null;

    if (!nextGroupLabel || nextGroupLabel === collectionState.selectedGroupLabel) {
      return;
    }

    collectionState.selectedGroupLabel = nextGroupLabel;
    ensureSelectedFish();
    renderCollection();
    return;
  }

  const buttonElement = event.target.closest("[data-collection-fish]");

  if (!buttonElement) {
    return;
  }

  const itemId = buttonElement.dataset.collectionFish;

  if (!getFishItem(itemId)) {
    return;
  }

  collectionState.selectedFishId = itemId;
  renderCollection();
}

function initCollection(options) {
  collectionState.rootElement = options.rootElement || null;
  collectionState.titleElement = options.titleElement || null;
  collectionState.sidebarElement = options.sidebarElement || null;
  collectionState.groupsElement = options.groupsElement || null;
  collectionState.previewImageElement = options.previewImageElement || null;
  collectionState.previewEmptyElement = options.previewEmptyElement || null;
  collectionState.featuredNameElement = options.featuredNameElement || null;
  collectionState.featuredRegionElement = options.featuredRegionElement || null;
  collectionState.featuredDescriptionElement = options.featuredDescriptionElement || null;

  if (!collectionState.initialized && collectionState.rootElement) {
    collectionState.rootElement.addEventListener("click", handleCollectionClick);
    collectionState.initialized = true;
  }

  ensureSelectedGroup();
  ensureSelectedFish();
  renderCollection();
}

window.CollectionUI = {
  init: initCollection,
  render: renderCollection,
  setConfig: setCollectionConfig,
};
})();
