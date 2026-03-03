const catchPromptEl = document.getElementById("catchPrompt");
const minigameEl = document.getElementById("minigame");
const movingBarEl = document.getElementById("movingBar");
const timerBarEl = document.getElementById("timerBar");

function fishingSetVisible(element, visible) {
	element.classList.toggle("fishing-hidden", !visible);
}

function clampFishing(value) {
	const number = Number(value);
	if (Number.isNaN(number)) {
		return 0;
	}
	if (number < 0) {
		return 0;
	}
	if (number > 1) {
		return 1;
	}
	return number;
}

function setCenteredWidth(element, ratio) {
	element.style.width = `${clampFishing(ratio) * 100}%`;
}

function resetFishingHud() {
	fishingSetVisible(catchPromptEl, false);
	fishingSetVisible(minigameEl, false);
	setCenteredWidth(movingBarEl, 0);
	setCenteredWidth(timerBarEl, 0);
	movingBarEl.style.background = "rgba(255, 51, 51, 0.59)";
}

window.addEventListener("message", (event) => {
	const data = event.data || {};

	if (data.action === "catchPrompt") {
		fishingSetVisible(catchPromptEl, !!data.visible);
		return;
	}

	if (data.action === "minigame") {
		fishingSetVisible(minigameEl, !!data.visible);
		return;
	}

	if (data.action === "progress") {
		setCenteredWidth(timerBarEl, data.timer);
		setCenteredWidth(movingBarEl, data.bar);
		movingBarEl.style.background = data.successState ? "rgba(102, 255, 102, 0.59)" : "rgba(255, 51, 51, 0.59)";
		return;
	}
});

resetFishingHud();
