// Pričekaj da DOM bude učitan/spreman
document.addEventListener("DOMContentLoaded", event => {
  if (event.target.readyState === "interactive") {
    getOrders();
  }
});

// Funkcija koja prima listu svih narudžbi i prikazuje ih na web stranici
function displayOrders(orders) {
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i]; // Objekt sa svim podacima o narudžbi

    // Kreiraj <article class="order-item"></article> element sa svim info o narudžbi
    const article = document.createElement("article");
    article.classList.add("order-item");
    article.innerHTML = `
      <div class="time">
        <span>Vrijeme narudžbe:</span>
        <strong>${order.Date}</strong>
      </div>
      <div class="pizzas">
        <span>Naručene pizze:</span>
        <ul>
          ${getPizzas(order.Pizzas.split("_"))}
        </ul>
      </div>
      <div class="total-price">
        <span>Ukupna cijena:</span> <em>${order.TotalPrice} kn</em>
      </div>`;

    // Prikaži na web stranici trenutnu narudžbu
    document.getElementById("orders").appendChild(article);
  }
}

// Vraća listu <li> elemenata s pizzama koje su naručene u toj narudžbi
function getPizzas(pizzas) {
  return pizzas.map(pizza => `<li>${pizza}</li>`).join("");
}

// Funkcija koja radi HTTP GET zahtjev dohvaćanje narudžbi s API-a
function getOrders() {
  fetch("php/api.php?action=getOrders")
    .then(response => response.json()) // Response pretvori u JSON
    .then(data => displayOrders(data.data)) // Pozovi funkciju za prikaz podataka ("data")
    .catch(err => console.error(err));
}
