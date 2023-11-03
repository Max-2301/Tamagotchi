let canvasW = 800;
let canvasH = 600;
let saveGame;
let loadGame;
let saved = false;
let loaded = false;
function setup() {
  createCanvas(canvasW, canvasH);
  saved = JSON.parse(localStorage.getItem("saved"));
  saveGame = new Button("SAVE", canvasW / 2 + 50, 30, saveVariables);
  saveGame.hiddenOrShown();
  loadGame = new Button("LOAD", canvasW / 2 - 50, 30, loadVariables);
  if (!saved) {
    loadGame.hiddenOrShown();
  }
  if (timerPaused) {
    stopTimer();
  }
  //timer
  endTime = new Date();
  endTime.setTime(endTime.getTime() + timerDuration);
  let plusFiveMinuteButton = new Button("+5.00", (canvasW / 4) * 3 - 100, 400, () => {
    addMinutes(5 * 60 * 1000);
  });
  let plusTenMinuteButton = new Button("+10.00", (canvasW / 4) * 3 + 100, 400, () => {
    addMinutes(10 * 60 * 1000);
  });
  let zeroButton = new Button("0.00", (canvasW / 4) * 3 - 100, 500, () => {
    setMinutes(0);
  });
  let twentyFiveMinuteButton = new Button("2.00", (canvasW / 4) * 3 + 100, 500, () => {
    setMinutes(timerDuration);
  });
  let startTimeButton = new Button("SLEEP", (canvasW / 4) * 3 - 100, 300, () => {
    if (timerPaused) {
      startTimer();
    }
  });
  let stopButton = new Button("STOP", (canvasW / 4) * 3 + 100, 300, () => {
    if (!timerPaused) {
      stopTimer();
    }
  });
  rectMode(CENTER);
  textAlign(CENTER);

  //shop
  openedShop = new Button("SHOP", shopX, canvasH - 25, openCloseShop);

  //tamaGotchi
  sleepyBar = new Bar(maxSleepynes, 150, 100, 100, 20, "blue");
  happyBar = new Bar(maxHappines, 150, 150, 100, 20, "orange");
}
function loadAvailable() {
  loadGame.hiddenOrShown();
}
function saveAvailable() {
  saveGame.hiddenOrShown();
  gameStarted = true;
}
function loadVariables() {
  //timer
  endTime = new Date(localStorage.getItem("endTime"));
  pauseTime = new Date(localStorage.getItem("pauseTime"));
  startTime = new Date(localStorage.getItem("startTime"));
  timerPaused = JSON.parse(localStorage.getItem("timerPaused"));
  //shop
  totalCoins = parseInt(localStorage.getItem("totalCoins"));
  coinsTime = new Date(localStorage.getItem("coinsTime"));
  shopItems = JSON.parse(localStorage.getItem("shopItems"));
  items = JSON.parse(localStorage.getItem("items"));
  //tamaGotchi
  happiness = parseInt(localStorage.getItem("hapiness"));
  stoppedHappiness = parseInt(localStorage.getItem("stoppedHapiness"));
  sleepynes = parseInt(localStorage.getItem("sleepynes"));
  stoppedSleepynes = parseInt(localStorage.getItem("stoppedSleepynes"));
  sleeping = JSON.parse(localStorage.getItem("sleeping"));
  sleepynesTime = new Date(localStorage.getItem("sleepynesTime"));
}
function saveVariables() {
  saved = true;
  localStorage.setItem("saved", JSON.stringify(saved));
  //timer
  localStorage.setItem("endTime", endTime);
  if (timerPaused) {
    localStorage.setItem("pauseTime", pauseTime);
  }
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("timerPaused", JSON.stringify(timerPaused));
  //shop
  localStorage.setItem("totalCoins", totalCoins);
  localStorage.setItem("coinsTime", coinsTime);
  localStorage.setItem("shopItems", JSON.stringify(shopItems));
  localStorage.setItem("items", JSON.stringify(items));
  // tamaGotchi
  localStorage.setItem("hapiness", happiness);
  localStorage.setItem("stoppedHapiness", stoppedHappiness);
  localStorage.setItem("sleepynes", sleepynes);
  localStorage.setItem("stoppedSleepynes", stoppedSleepynes);
  localStorage.setItem("sleeping", JSON.stringify(sleeping));
  localStorage.setItem("sleepinesTime", sleepynesTime);
  //show load on first save
  if (loadGame.show == false && saved) {
    loadAvailable();
  }
}

function draw() {
  background(220);
  //timer
  timer();
  line(canvasW / 2, 0, canvasW / 2, canvasH);
  text("TOTAL COINS: " + totalCoins + "               COLLECTING: " + collectedCoins, (canvasW / 4) * 3, 70);
  //shop
  displayItems();
  if (shopping) {
    shop();
  }
  //tamagotchi
  text("Sleepy Meter", canvasW / 4, 80);
  sleepyBar.showBar(sleepynes);
  text("Happy Meter", canvasW / 4, 130);

  happyBar.showBar(happiness);
  displayTamaGotchi();
}

//timer
let time;
let pauseTime;
let startTime;
let timerPaused = true;
let totalCoins = 0;
let collectedCoins = 0;
const timerDuration = 2 * 60 * 1000;
function setMinutes(setTime) {
  endTime = new Date();
  endTime.setTime(endTime.getTime() + setTime);
}
function addMinutes(addTime) {
  if (time >= endTime) {
    endTime = new Date();
  }
  endTime.setTime(endTime.getTime() + addTime);
}
let gameStarted = false;
function startTimer() {
  const pausedTime = new Date().getTime() - pauseTime.getTime();
  endTime.setTime(endTime.getTime() + pausedTime);
  timerPaused = false;
  startTime = new Date();
  coinsTime = new Date();
  sleepynesTime = new Date();
}
function stopTimer() {
  pauseTime = new Date();
  timerPaused = true;
  totalCoins += collectedCoins;
  collectedCoins = 0;
  stoppedSleepynes = sleepynes;
  sleeping = false;
}
let remainingTime, minutes, seconds;
function timer() {
  time = new Date();
  if (sleepynes > 0 || !gameStarted) {
    if (time >= endTime) {
      stopTimer();
      remainingTime = 0;
    } else {
      if (timerPaused) {
        remainingTime = endTime - pauseTime;
      } else {
        countCoins();
        sleeping = true;
        countSleeping();
        remainingTime = endTime - time;
      }
    }
  } else if (!timerPaused) {
    stopTimer();
  }
  minutes = Math.floor(remainingTime / (60 * 1000));
  seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
  push();
  rect((canvasW / 4) * 3, 100, 100, 50);
  textSize(32);
  text(addZero(minutes) + minutes + ":" + addZero(seconds) + seconds, (canvasW / 4) * 3, 110, 100, 50);
  pop();
}
function addZero(number) {
  if (number.toString().length == 1) {
    return "0";
  } else {
    return "";
  }
}

let coinsTime;
const coinsAddTime = 1 * 1000;
function countCoins() {
  if (time >= coinsTime) {
    coinsTime.setTime(coinsTime.getTime() + coinsAddTime);
    if (time >= endTime) {
      collectedCoins = floor((endTime - startTime) / coinsAddTime);
    } else {
      collectedCoins = floor((time - startTime) / coinsAddTime);
    }
  }
}

//shop
let itemFunct = [ball, rect];
let shopItems = [
  {
    item: "BALL",
    cost: 0,
    purchased: true,
    addHappiness: 5,
    funct: 0,
    color: "red",
  },
  {
    item: "CUBE",
    cost: 100,
    purchased: false,
    addHappiness: 10,
    funct: 1,
    color: "black",
  },
  {
    item: "S BALL",
    cost: 1000,
    purchased: false,
    addHappiness: 100,
    funct: 0,
    color: "yellow",
  },
  {
    item: "G BALL",
    cost: 500,
    purchased: false,
    addHappiness: 50,
    funct: 0,
    color: "green",
  },
];
let freeItem = 0;
let items = [{ item: shopItems[freeItem].item, addHappiness: shopItems[freeItem].addHappiness, funct: shopItems[freeItem].funct, color: shopItems[freeItem].color }];
let openedShop;
let shopping = false;
function openCloseShop() {
  openedShop.hiddenOrShown();
  shopping = !shopping;
  shopMaxY = (canvasH / 4) * 3.5;
}
let shopH = 200;
let shopW = 200;
let shopY = canvasH + shopH;
let shopX = 110;
let shopMaxY = (canvasH / 4) * 3.5;
function shop() {
  //check if u wanna close the shop
  if (mouseIsPressed && checkMouse(shopX - 20, canvasW / 4 + 20, shopY - shopH / 2, shopY - shopH / 2 + 15)) {
    shopMaxY = canvasH + shopH;
  }

  if (shopY > shopMaxY) {
    shopY -= 5;
  } else if (shopY < shopMaxY) {
    shopY += 5;
  } else if (shopY == canvasH + shopH) {
    openCloseShop();
  }

  push();
  rect(shopX, shopY, shopW, shopH);
  triangle(shopX - 20, shopY - shopH / 2, shopX + 20, shopY - shopH / 2, shopX, shopY - shopH / 2 + 20);
  textSize(8);
  text("CLOSE", shopX, shopY - shopH / 2 + 8);
  for (let i = 0; i < shopItems.length; i++) {
    if (shopItems[i].purchased) {
      fill("grey");
    } else if (totalCoins >= shopItems[i].cost) {
      fill("green");
    } else {
      fill("red");
    }
    textSize(15);
    textAlign(LEFT);
    text(shopItems[i].item + " = " + shopItems[i].cost, shopX - shopW / 2 + 5, 20 * i + shopY - shopH / 2 + 50);
    circle(shopX + 90, 20 * i + shopY - shopH / 2 + 50 - 5, 5);
    if (totalCoins >= shopItems[i].cost && !shopItems[i].purchased) {
      if (mouseIsPressed && mouseX < shopX + 90 + 2.5 && mouseX > shopX + 90 - 2.5 && mouseY < 20 * i + shopY - shopH / 2 + 50 - 5 + 2.5 && mouseY > 20 * i + shopY - shopH / 2 + 50 - 5 - 2.5) {
        shopItems[i].purchased = true;
        items.push({ item: shopItems[i].item, addHappiness: shopItems[i].addHappiness, funct: shopItems[i].funct, color: shopItems[i].color });
        totalCoins = totalCoins - shopItems[i].cost;
      }
    }
  }
  pop();
}

let useItemInterval;
let useItemI = 0;
function useItem(happinessAdd, sleepynesAdd) {
  useItemI++;
  happiness += happinessAdd;
  sleepynes += sleepynesAdd;
  if (useItemI >= items[selectedItem].addHappiness || sleepynes >= maxSleepynes || !timerPaused) {
    if (happiness > maxHappines) {
      happiness = maxHappines;
    }
    useItemI = 0;
    itemGiven = false;
    stoppedHappiness = happiness;
    stoppedSleepynes = sleepynes;
    clearInterval(useItemInterval);
    useItemInterval = null;
  }
}

let itemSelector;
let selectedItem = 0;
let itemXset = canvasW / 2 - 100;
let itemYset = canvasH - 50;
let itemX;
let itemY;
let itemGiven = false;
function displayItems() {
  if (timerPaused) {
    if (mouseReleasedCheck() && !itemGiven && sleepynes < maxSleepynes) {
      if (checkMouse(tamaGotchiX - 200, tamaGotchiX + 200, tamaGotchiY - 100, tamaGotchiY + 100) && itemClicked) {
        itemGiven = true;
        useItemInterval = setInterval(() => {
          useItem(1.5, 1, 0);
        }, 1000);
      }
    }
  }
  if (mouseIsPressed) {
    //moveChosenItem
    if (checkMouse(itemX - 15, itemX + 15, itemY - 15, itemY + 15)) {
      itemClicked = true;
    }
    if (itemClicked && mouseX < canvasW / 2 - 15) {
      itemX = mouseX;
      itemY = mouseY;
    }
  } else {
    itemClicked = false;
    itemX = itemXset;
    itemY = itemYset;
  }
  push();
  textSize(10);
  circle(itemXset, itemYset, 50);
  triangle(itemXset - 40, itemYset, itemXset - 30, itemYset + 10, itemXset - 30, itemYset - 10);
  triangle(itemXset + 40, itemYset, itemXset + 30, itemYset + 10, itemXset + 30, itemYset - 10);
  text(items[selectedItem].item, itemXset, itemYset + 5);
  if (!timerPaused || itemGiven) {
    fill("grey");
  } else {
    fill(items[selectedItem].color);
  }
  itemFunct[items[selectedItem].funct]();
  pop();
}

function ball() {
  circle(itemX, itemY, 35);
}
function rect() {
  rect(itemX, itemY, 25, 25);
}

const happinessAddTime = 0.8 * 1000;
let happiness = 80;
let stoppedHappiness = happiness;
const maxHappines = 100;
let happyBar;

const sleepynesAddTime = 1 * 1000;
let sleepynesTime;
let sleepynes = 50;
let stoppedSleepynes = sleepynes;
const maxSleepynes = 100;
let sleeping = false;
let sleepyBar;
function countSleeping() {
  if (time >= sleepynesTime) {
    sleepynesTime.setTime(sleepynesTime.getTime() + sleepynesAddTime);
    if (time >= endTime) {
      sleepynes = stoppedSleepynes - floor((endTime - startTime) / sleepynesAddTime);
      happiness = stoppedHappiness - floor((endTime - startTime) / happinessAddTime);
    } else {
      sleepynes = stoppedSleepynes - floor((time - startTime) / sleepynesAddTime);
      if (happiness > 0) {
        happiness = stoppedHappiness - floor((time - startTime) / happinessAddTime);
        if (happiness < 0) {
          happiness = 0;
        }
      }
    }
  }
}

tamaGotchiX = canvasW / 4;
tamaGotchiY = 300;
let delayed = false;
let randomXZ;
let randomYZ;
let zInterval;
let happyInterval;
let happyIntervalI = 0;
let itemGivenInterval;
let itemGivenInteralI = 0;
function displayTamaGotchi() {
  //sleaping
  push();
  if (sleeping) {
    if (!delayed) {
      delayed = true;
      zInterval = setInterval(zSleeping, 500);
    }
    text("z", randomXZ, randomYZ);
    circle(tamaGotchiX, tamaGotchiY + 100, 40);
    noFill();
    arc(tamaGotchiX - 75, tamaGotchiY, 50, 20, 0, PI);
    arc(tamaGotchiX + 75, tamaGotchiY, 50, 20, 0, PI);
    pop();
  } else if (itemGiven) {
    push();
    console.log;
    if (!delayed) {
      delayed = true;
      itemGivenInterval = setInterval(itemGivenDisplay, 500);
    }
    if (itemGivenInteralI < 4) {
      noFill();
      arc(tamaGotchiX - 100, tamaGotchiY, 100, 20, 0, HALF_PI);
      arc(tamaGotchiX + 50, tamaGotchiY, 100, 20, 0, HALF_PI);
    } else {
      fill("white");
      for (let i = 2; i > 0; i--) {
        circle(tamaGotchiX - 80, tamaGotchiY, 10 * i + 50);
        circle(tamaGotchiX + 80, tamaGotchiY, 10 * i + 50);
      }
    }
    noFill();
    arc(tamaGotchiX, tamaGotchiY + 100, 200, 20, 0, PI);
    pop();
  } else if (happiness > 66) {
    push();
    if (!delayed) {
      delayed = true;
      happyInterval = setInterval(happyDisplay, 500);
    }
    if (happyIntervalI < 4) {
      for (let i = 2; i > 0; i--) {
        circle(tamaGotchiX - 80, tamaGotchiY, 10 * i + 50);
        circle(tamaGotchiX + 80, tamaGotchiY, 10 * i + 50);
      }
    } else {
      line(tamaGotchiX - 100, tamaGotchiY, tamaGotchiX - 50, tamaGotchiY);
      line(tamaGotchiX + 100, tamaGotchiY, tamaGotchiX + 50, tamaGotchiY);
    }
    noFill();
    arc(tamaGotchiX, tamaGotchiY + 100, 200, 20, 0, PI);
    pop();
  } else if (happiness > 33) {
    //nutral
    line(tamaGotchiX - 100, tamaGotchiY, tamaGotchiX - 50, tamaGotchiY);
    line(tamaGotchiX + 100, tamaGotchiY, tamaGotchiX + 50, tamaGotchiY);
    line(tamaGotchiX - 100, tamaGotchiY + 100, tamaGotchiX + 100, tamaGotchiY + 100);
  } else if (happiness > 0) {
    //sad
    push();
    noFill();
    arc(tamaGotchiX - 100, tamaGotchiY, 100, 20, 0, HALF_PI);
    arc(tamaGotchiX + 50, tamaGotchiY, 100, 20, 0, HALF_PI);
    line(tamaGotchiX - 100, tamaGotchiY + 100, tamaGotchiX + 100, tamaGotchiY + 100);
    pop();
  } else {
    line(tamaGotchiX + 100, tamaGotchiY, tamaGotchiX + 50, tamaGotchiY + 50);
    line(tamaGotchiX + 50, tamaGotchiY, tamaGotchiX + 100, tamaGotchiY + 50);
    line(tamaGotchiX - 100, tamaGotchiY, tamaGotchiX - 50, tamaGotchiY + 50);
    line(tamaGotchiX - 50, tamaGotchiY, tamaGotchiX - 100, tamaGotchiY + 50);
    circle(tamaGotchiX, tamaGotchiY + 100, 40);
  }
}
function zSleeping() {
  randomXZ = random(tamaGotchiX + 50, tamaGotchiX + 80);
  randomYZ = random(tamaGotchiY - 110, tamaGotchiY - 50);
  if (!sleeping) {
    delayed = false;
    clearInterval(zInterval);
    zInterval = null;
  }
}
function happyDisplay() {
  happyIntervalI++;
  if (happyIntervalI > 5) {
    happyIntervalI = 0;
    delayed = false;
    clearInterval(happyInterval);
    happyInterval = null;
  }
}
function itemGivenDisplay() {
  console.log(itemGivenInteralI);
  itemGivenInteralI++;
  if (itemGivenInteralI > 5) {
    itemGivenInteralI = 0;
    delayed = false;
    clearInterval(itemGivenInterval);
    itemGivenInterval = null;
  }
}
function mouseClicked() {
  if (!gameStarted) {
    saveAvailable();
  }
  //nextItem
  if (checkMouse(itemXset - 40, itemXset - 30, itemYset - 10, itemYset + 10) || checkMouse(itemXset + 30, itemXset + 40, itemYset - 10, itemYset + 10)) {
    selectedItem++;
    if (selectedItem >= items.length) {
      selectedItem = 0;
    }
  }
}

let clicked = false;
function mouseReleasedCheck() {
  if (!clicked && mouseIsPressed) {
    clicked = true;
  } else if (!mouseIsPressed && clicked) {
    clicked = false;
    return true;
  }
}
function checkMouse(x, x2, y, y2) {
  return mouseX >= x && mouseX <= x2 && mouseY >= y && mouseY <= y2;
}
