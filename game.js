const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

const startersDiv = document.getElementById("starters");
const playerBlock = document.getElementById("player-block");
const playerInfo = document.getElementById("player-info");
const battleBlock = document.getElementById("battle-block");
const battleLog = document.getElementById("battle-log");
const moveButtons = document.getElementById("move-buttons");

const tileSize = 40;
const mapWidth = canvas.width / tileSize;
const mapHeight = canvas.height / tileSize;

const terrain = [];
for (let y = 0; y < mapHeight; y += 1) {
  const row = [];
  for (let x = 0; x < mapWidth; x += 1) {
    const border = x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1;
    const grassPatch = (x > 8 && x < 14 && y > 2 && y < 8) || (x > 2 && x < 7 && y > 5 && y < 9);
    row.push(border ? "wall" : grassPatch ? "grass" : "ground");
  }
  terrain.push(row);
}

const creatures = {
  Snivy: {
    name: "Snivy",
    maxHp: 48,
    type: "Grass",
    color: "#22c55e",
    moves: [
      { name: "Vine Whip", power: 13 },
      { name: "Tackle", power: 10 },
      { name: "Leaf Blade", power: 16 },
      { name: "Growth", power: 0, heal: 10 },
    ],
  },
  Tepig: {
    name: "Tepig",
    maxHp: 52,
    type: "Fire",
    color: "#f97316",
    moves: [
      { name: "Ember", power: 14 },
      { name: "Tackle", power: 10 },
      { name: "Flame Charge", power: 16 },
      { name: "Rest", power: 0, heal: 10 },
    ],
  },
  Oshawott: {
    name: "Oshawott",
    maxHp: 50,
    type: "Water",
    color: "#38bdf8",
    moves: [
      { name: "Water Gun", power: 14 },
      { name: "Tackle", power: 10 },
      { name: "Razor Shell", power: 16 },
      { name: "Focus", power: 0, heal: 10 },
    ],
  },
  Patrat: {
    name: "Patrat",
    maxHp: 34,
    type: "Normal",
    color: "#a78bfa",
    moves: [
      { name: "Bite", power: 9 },
      { name: "Tackle", power: 8 },
      { name: "Leer", power: 7 },
      { name: "Snack Time", power: 0, heal: 6 },
    ],
  },
  Pidove: {
    name: "Pidove",
    maxHp: 36,
    type: "Flying",
    color: "#94a3b8",
    moves: [
      { name: "Gust", power: 10 },
      { name: "Quick Attack", power: 9 },
      { name: "Peck", power: 11 },
      { name: "Roost", power: 0, heal: 6 },
    ],
  },
  Blitzle: {
    name: "Blitzle",
    maxHp: 38,
    type: "Electric",
    color: "#facc15",
    moves: [
      { name: "Spark", power: 11 },
      { name: "Tackle", power: 8 },
      { name: "Shock Wave", power: 12 },
      { name: "Charge", power: 0, heal: 7 },
    ],
  },
};

const wildPool = ["Patrat", "Pidove", "Blitzle"];

const player = {
  x: 3,
  y: 3,
  hp: 0,
  maxHp: 0,
  creature: null,
};

const gameState = {
  mode: "starter",
  battle: null,
};

function setupStarters() {
  ["Snivy", "Tepig", "Oshawott"].forEach((name) => {
    const button = document.createElement("button");
    button.textContent = `${name} (${creatures[name].type})`;
    button.addEventListener("click", () => chooseStarter(name));
    startersDiv.appendChild(button);
  });
}

function chooseStarter(name) {
  const chosen = structuredClone(creatures[name]);
  player.creature = chosen;
  player.maxHp = chosen.maxHp;
  player.hp = chosen.maxHp;

  document.getElementById("starter-block").classList.add("hidden");
  playerBlock.classList.remove("hidden");
  updatePlayerPanel();

  gameState.mode = "explore";
  addBattleLog(`You chose ${name}! Walk in grass to find wild Pokémon.`);
}

function updatePlayerPanel() {
  if (!player.creature) {
    return;
  }
  const hpClass = player.hp > player.maxHp * 0.35 ? "good" : "bad";
  playerInfo.innerHTML = `
    <p><strong>${player.creature.name}</strong> (${player.creature.type})</p>
    <p class="hp ${hpClass}">HP: ${player.hp} / ${player.maxHp}</p>
  `;
}

function drawMap() {
  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      const tile = terrain[y][x];
      if (tile === "wall") {
        ctx.fillStyle = "#475569";
      } else if (tile === "grass") {
        ctx.fillStyle = "#166534";
      } else {
        ctx.fillStyle = "#1f9d55";
      }
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "rgba(15,23,42,0.25)";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.creature ? player.creature.color : "#f8fafc";
  ctx.fillRect(player.x * tileSize + 8, player.y * tileSize + 8, tileSize - 16, tileSize - 16);
}

function render() {
  drawMap();
  drawPlayer();

  if (gameState.mode === "battle") {
    ctx.fillStyle = "rgba(2,6,23,0.76)";
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

    const { enemy } = gameState.battle;
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(160, 180, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = player.creature.color;
    ctx.beginPath();
    ctx.arc(470, 250, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "18px sans-serif";
    ctx.fillText(`Wild ${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}`, 90, 120);
    ctx.fillText(`${player.creature.name} HP: ${player.hp}/${player.maxHp}`, 390, 325);
  }

  requestAnimationFrame(render);
}

function movePlayer(dx, dy) {
  if (gameState.mode !== "explore") {
    return;
  }

  const nx = player.x + dx;
  const ny = player.y + dy;
  if (terrain[ny][nx] === "wall") {
    return;
  }

  player.x = nx;
  player.y = ny;

  if (terrain[ny][nx] === "grass" && Math.random() < 0.2) {
    startBattle();
  }
}

function getWildCreature() {
  const name = wildPool[Math.floor(Math.random() * wildPool.length)];
  const wild = structuredClone(creatures[name]);
  wild.hp = wild.maxHp;
  return wild;
}

function startBattle() {
  const enemy = getWildCreature();
  gameState.mode = "battle";
  gameState.battle = { enemy, playerTurn: true };
  battleBlock.classList.remove("hidden");
  addBattleLog(`A wild ${enemy.name} appeared!`);
  renderMoves();
}

function addBattleLog(text) {
  const row = document.createElement("div");
  row.textContent = text;
  battleLog.prepend(row);
}

function renderMoves() {
  moveButtons.innerHTML = "";
  player.creature.moves.forEach((move, idx) => {
    const button = document.createElement("button");
    button.textContent = `${idx + 1}. ${move.name}`;
    button.addEventListener("click", () => playerAttack(move));
    moveButtons.appendChild(button);
  });
}

function applyMove(attackerName, move, target, onHeal) {
  if (move.heal) {
    onHeal(move.heal);
    addBattleLog(`${attackerName} used ${move.name} and healed ${move.heal} HP!`);
    return;
  }

  const variance = Math.floor(Math.random() * 4);
  const damage = move.power + variance;
  target.hp = Math.max(0, target.hp - damage);
  addBattleLog(`${attackerName} used ${move.name}! It dealt ${damage} damage.`);
}

function setMoveButtonsDisabled(disabled) {
  [...moveButtons.querySelectorAll("button")].forEach((button) => {
    button.disabled = disabled;
  });
}

function playerAttack(move) {
  if (gameState.mode !== "battle") {
    return;
  }

  const { enemy } = gameState.battle;
  setMoveButtonsDisabled(true);

  applyMove(player.creature.name, move, enemy, (heal) => {
    player.hp = Math.min(player.maxHp, player.hp + heal);
  });

  if (enemy.hp <= 0) {
    addBattleLog(`Wild ${enemy.name} fainted. You won!`);
    endBattle(true);
    return;
  }

  updatePlayerPanel();

  setTimeout(() => {
    enemyTurn();
    if (gameState.mode === "battle") {
      setMoveButtonsDisabled(false);
    }
  }, 600);
}

function enemyTurn() {
  const { enemy } = gameState.battle;
  const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

  applyMove(enemy.name, enemyMove, player, (heal) => {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + heal);
  });

  if (player.hp <= 0) {
    addBattleLog(`${player.creature.name} fainted! You rushed to the Poké Center and recovered.`);
    player.hp = player.maxHp;
    endBattle(false);
    return;
  }

  updatePlayerPanel();
}

function endBattle(victory) {
  gameState.mode = "explore";
  gameState.battle = null;
  updatePlayerPanel();
  if (victory) {
    addBattleLog("Keep exploring the route for more encounters.");
  }
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "arrowup" || key === "w") movePlayer(0, -1);
  if (key === "arrowdown" || key === "s") movePlayer(0, 1);
  if (key === "arrowleft" || key === "a") movePlayer(-1, 0);
  if (key === "arrowright" || key === "d") movePlayer(1, 0);
});

setupStarters();
render();
