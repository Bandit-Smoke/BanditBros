const gamePanel = document.getElementById("game-panel");
const closeGame = document.getElementById("close-game");
const container = document.getElementById("games-container");

const panelImage = document.getElementById("panel-image");
const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const panelDetails = document.getElementById("panel-details");
const panelLink = document.getElementById("panel-link");

// Fill the dialog with one game's data
function openGamePanel(game) {
    panelImage.src = game.panelImage || game.capsule;
    panelImage.alt = game.title;
    panelTitle.textContent = game.title;
    panelDescription.textContent = game.description || "";

    // Rebuild the details list from whatever key/value pairs the game has
    panelDetails.replaceChildren();
    for (const [label, value] of Object.entries(game.details || {})) {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = label + ": ";
        li.append(strong, value);
        panelDetails.appendChild(li);
    }

    // Only show the button if the game has a link
    if (game.link && game.link.url) {
        panelLink.textContent = game.link.label || "Learn More";
        panelLink.href = game.link.url;
        panelLink.hidden = false;
    } else {
        panelLink.hidden = true;
    }

    gamePanel.showModal();
}

// Build one capsule button per game
function renderGames(games) {
    container.replaceChildren();
    for (const game of games) {
        const button = document.createElement("button");
        button.className = "game-button";
        button.dataset.game = game.id;

        const img = document.createElement("img");
        img.src = game.capsule;
        img.width = 300;
        img.alt = game.title;

        button.appendChild(img);
        button.addEventListener("click", () => openGamePanel(game));
        container.appendChild(button);
    }
}

async function loadGames() {
    try {
        const response = await fetch("config.json");
        if (!response.ok) throw new Error("HTTP " + response.status);
        const config = await response.json();
        renderGames(config.games);
    } catch (err) {
        console.error("Could not load config.json:", err);
        container.textContent = "Couldn't load projects right now.";
    }
}

closeGame.addEventListener("click", () => gamePanel.close());

// Click on the dark area outside the panel to close it
gamePanel.addEventListener("click", (e) => {
    if (e.target === gamePanel) gamePanel.close();
});

loadGames();