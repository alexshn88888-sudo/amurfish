const SUPABASE_URL = "https://ombhbcsjwwnvqcwwytql.supabase.co";
const SUPABASE_KEY = "PUT_YOUR_ANON_KEY_HERE";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let cart = [];
let products = [];

// =====================
// ЗАГРУЗКА ТОВАРОВ
// =====================
async function loadProducts() {
  let { data } = await client.from("products").select("*");
  products = data || [];
  renderProducts();
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
// КОРЗИНА
// =====================
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  renderCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cart");

  let total = cart.reduce((s, i) => s + Number(i.price), 0);

  box.innerHTML = `
    <h3>Корзина</h3>
    <p>Товаров: ${cart.length}</p>
    <p><b>Итого: ${total} ₽</b></p>
    <button onclick="createOrder()">Оформить заказ</button>
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
// ЗАКАЗ
// =====================
async function createOrder() {
  let total = cart.reduce((s, i) => s + Number(i.price), 0);

  await client.from("orders").insert([
    {
      items: cart,
      total: total
    }
  ]);

  alert("Заказ оформлен!");
  cart = [];
  renderCart();
}

// =====================
// INIT
// =====================
loadProducts();
renderCart();
