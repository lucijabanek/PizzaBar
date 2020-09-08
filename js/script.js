// Kad se klikne na žutu shopping ikonu, otvori/zatvori 'side-menu' s desne strane
document.getElementById("shopping").addEventListener("click", () => {
  document.getElementById("shopping-side-menu").classList.toggle("active");
});

let count = 0; // Početna vrijednost 'shopping-count'-a (brojač iznad žute košarice)
document.getElementById("shopping-count").innerText = count;

// Funkcija koja postavlja brojač iznad ikone od žute košarice
function setCount() {
  let totalCount = 0; // Prvobitno brojač stavit na 0
  const allItems = document.querySelectorAll(".shopping-item");
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    // Dohvati količinu za svaku pizzu u košarici i nadodaj na ukupni brojač
    const itemAmount = item.querySelector(".amount").textContent;
    totalCount += parseInt(itemAmount);
  }
  document.getElementById("shopping-count").innerText = totalCount;
}

// Pronađi sva 3 crvena 'Naruči' button-a i spremi ih u listu 'pizzaButtons'
const pizzaButtons = document.querySelectorAll(".pizza-card button");
for (let i = 0; i < pizzaButtons.length; i++) {
  const button = pizzaButtons[i];
  // Za svaki od ta 3 button-a postavi da zove funkciju 'handleOrderButton()' kad se na njega klikne
  button.addEventListener("click", handleOrderButton);
}

// Ova funkcija se poziva svaki put kad se pizza naruči
function handleOrderButton(event) {
  const clickedButton = event.currentTarget; // Spremi kliknuti button u varijablu
  const pizzaCard = clickedButton.parentElement; // 'Roditelj' od button-a je 'article'

  // Dohvati naziv i cijenu pizze
  const pizzaName = pizzaCard.querySelector("h3").innerText;
  const pizzaPrice = pizzaCard.querySelector("small > em").innerText;

  // Provjeri da li već postoji pizza s ovim imenom u '#shopping-side-menu'
  const clickedPizza = document.querySelector(
    `.shopping-item#${pizzaName.toLowerCase()}`
  );
  if (!clickedPizza) {
    // Ako ne postoji, kreiraj novi element i ubaci ga u košaricu
    createShopItem(pizzaName, pizzaPrice);
  } else {
    // Ako već postoji, uvećaj joj količinu za 1
    const pizzaAmount = clickedPizza.querySelector(".amount");
    let amountNumber = parseInt(pizzaAmount.textContent); // ili: +pizzaAmount.textContent;
    pizzaAmount.innerText = ++amountNumber; // ++varijabla -> prvo uvećaj pa onda spremi

    // Enable-aj minus button jer povaćavamo količinu
    clickedPizza.querySelector(".minus").disabled = false;
  }

  calculateTotalPrice(); // Poziv funkcije koja će izračunati ukupnu cijenu
  setCount(); // Poziv funkcije koja će ponovno postaviti brojač
}

// Funkcija koja kreira novi 'shopping-item' u 'shopping-side-menu'
function createShopItem(name, price) {
  const shopItem = document.createElement("article"); // Kreiraj prazan 'article' element: <article></article>
  shopItem.classList.add("shopping-item"); // Dodaj mu klasu 'shopping-item': <article class="shopping-item"></article>
  shopItem.id = name.toLowerCase(); // Dodaj mu 'id': <article class="shopping-item" id="{naziv-pizze}"></article>

  shopItem.innerHTML = `
    <i class="fas fa-times close"></i>
    <h3>${name}</h3>
    <div class="item-info">
      <small>Cijena:</small>
      <strong class="price">${price}</strong>
    </div>
    <div class="item-info">
      <small>Količina:</small>
      <div class="amount-box">
        <button class="minus" disabled><i class="fas fa-minus"></i></button>
        <strong class="amount">1</strong>
        <button class="plus"><i class="fas fa-plus"></i></button>
      </div>
    </div>`;

  document.getElementById("shopping-items").appendChild(shopItem);

  // "Click listener" na 'x' ikonu za uklanjanje pizze iz košarice
  shopItem.querySelector(".close").addEventListener("click", handleRemoveClick);

  // "Click listener" na '+' (plus) ikonu za inkrement brojača količine pizze
  shopItem.querySelector(".plus").addEventListener("click", handlePlusClick);

  // "Click listener" na '-' (minus) ikonu za dekrement brojača količine pizze
  shopItem.querySelector(".minus").addEventListener("click", handleMinusClick);
}

// Funkcija koja računa ukupnu cijenu svih pizza u košarici
function calculateTotalPrice() {
  let totalPrice = 0;

  // Pronađi sve '.shopping-item'-e iz '#shopping-items'-u
  const shopItems = document.querySelectorAll(".shopping-item");
  for (let i = 0; i < shopItems.length; i++) {
    const item = shopItems[i];

    // Nađi cijenu i količinu za svaku pizzu
    const itemPrice = item.querySelector(".price").textContent; // npr. 22,00 kn
    const itemCount = item.querySelector(".amount").textContent;
    const onlyPrice = itemPrice.split(" ")[0];

    // Izračunaj cijenu za trenutnu vrstu pizze => cijena * količina
    const itemTotalPrice = parseFloat(onlyPrice) * parseInt(itemCount);

    // Zbroji cijenu trenutne vrste pizze s ukupnom cijenom
    totalPrice += itemTotalPrice;
  }

  document.querySelector("#total-price > strong").innerText =
    totalPrice.toFixed(2) + " kn";
}

// Funkcija koja uklanja pizzu iz košarice klikom na 'x' ikonu
function handleRemoveClick(event) {
  const clickedX = event.currentTarget;
  const item = clickedX.parentElement;
  item.remove(); // Ukloni '.shopping-item' element

  calculateTotalPrice(); // Ponovno izračunaj ukupnu cijenu
  setCount(); // Ponovno izračunaj koliko je pizza u košarici
}

// Funkcija koja inkrementira brojač količine za kliknutu pizzu u košarici
function handlePlusClick(event) {
  const clickedPlus = event.currentTarget;
  const amountBox = clickedPlus.parentElement;

  const amount = amountBox.querySelector(".amount");
  amount.textContent = ++amount.textContent;

  calculateTotalPrice(); // Ponovno izračunaj ukupnu cijenu
  setCount(); // Ponovno izračunaj koliko je pizza u košarici

  // Enable-aj minus button jer povaćavamo količinu
  amountBox.querySelector(".minus").disabled = false;
}

// Funkcija koja dekrementira brojač količine za kliknutu pizzu u košarici
function handleMinusClick(event) {
  const clickedMinus = event.currentTarget;
  const amountBox = clickedMinus.parentElement;

  const amount = amountBox.querySelector(".amount");
  if (+amount.textContent > 1) {
    amount.textContent = --amount.textContent;

    calculateTotalPrice(); // Ponovno izračunaj ukupnu cijenu
    setCount(); // Ponovno izračunaj koliko je pizza u košarici
  }

  // Enable-aj minus button samo ako je količina veća od 1
  clickedMinus.disabled = parseInt(amount.textContent) === 1 ? true : false;
}
