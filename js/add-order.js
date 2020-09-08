document
  .getElementById("order-btn")
  .addEventListener("click", handleButtonClick);

function handleButtonClick() {
  const totalPrice = document.querySelector("#total-price strong").textContent;
  const onlyPrice = totalPrice.split(" ")[0];
  const totalPriceFloat = parseFloat(onlyPrice);

  let str = "";
  const orderedPizzas = document.querySelectorAll(".shopping-item");
  for (let i = 0; i < orderedPizzas.length; i++) {
    const pizza = orderedPizzas[i];

    const name = pizza.querySelector("h3").textContent;
    const amount = pizza.querySelector(".amount").textContent;
    const price = pizza.querySelector(".price").textContent;
    const priceFloat = parseFloat(price.split(" ")[0]);
    str += `${name}(${priceFloat}x${amount})`;
    if (i !== orderedPizzas.length - 1) {
      str += "_";
    }
  }

  http(totalPriceFloat, str);
}

function http(totalPrice, pizzaString) {
  const params = {
    totalPrice: totalPrice,
    pizzas: pizzaString
  };

  const options = {
    method: "POST",
    body: JSON.stringify(params)
  };

  fetch("./php/api.php", options)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        calculateTotalPrice();
        setCount();
        alert("Uspješna narudžba!");
        let div = document.getElementById("shopping-items");
        while (div.firstChild) {
          div.removeChild(div.firstChild);
        }
        document.querySelector("#total-price strong").textContent = "0,00 kn";
        document.querySelector("#shopping span").textContent = 0;
      } else {
        alert("Dogodila se greška!");
        throw new Error(data.message);
      }
    })
    .catch(err => console.error(err));
}
