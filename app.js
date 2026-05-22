let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Навага свежемороженая",
    price: 105,
    description: "Свежая рыба со склада",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ТОВАРЫ
function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <b>${p.price} ₽</b>
        <button onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `;
  });
}

// КОРЗИНА
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  save();
  renderCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  save();
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cart");
  box.innerHTML = `<p>Товаров: ${cart.length}</p>`;

  cart.forEach((c, i) => {
    box.innerHTML += `
      <div>
        ${c.name} - ${c.price}₽
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });
}

renderProducts();
renderCart();
