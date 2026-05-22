let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Навага свежемороженая",
    price: 105,
    description: "Свежая рыба со склада",
    image: ""
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function save() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================
// ТОВАРЫ
// =====================
function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <img src="${p.image || 'https://via.placeholder.com/300'}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <b>${p.price} ₽</b>
        <button onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `;
  });
}

// =====================
// КОРЗИНА + СУММА
// =====================
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

  let total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  box.innerHTML = `
    <h3>Корзина</h3>
    <p>Товаров: ${cart.length}</p>
    <p><b>Итого: ${total} ₽</b></p>
  `;

  cart.forEach((c, i) => {
    box.innerHTML += `
      <div>
        ${c.name} - ${c.price}₽
        <button onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });
}

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================
renderProducts();
renderCart();
