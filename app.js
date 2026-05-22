// =======================
// AMURFISH SIMPLE STORE
// =======================

let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Навага свежемороженая",
    price: 105,
    description: "Свежая рыба со склада",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =======================
// SAVE
// =======================
function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
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

// =======================
// CART
// =======================
function addToCart(id) {
  const item = products.find((p) => p.id === id);
  cart.push(item);
  save();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  save();
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart");
  if (!container) return;

  container.innerHTML = `
    <h3>Корзина (${cart.length})</h3>
  `;

  cart.forEach((c, i) => {
    container.innerHTML += `
      <div>
        ${c.name} - ${c.price}₽
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });
}

// =======================
// INIT
// =======================
renderProducts();
renderCart();
