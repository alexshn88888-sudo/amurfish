
// =======================
// AMURFISH STORE FINAL
// =======================

// SUPABASE
const SUPABASE_URL = "https://ombhbcsjwwnvqcwwytql.supabase.co";

// ВСТАВЬ СВОЙ ANON KEY
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// DATA
let products = [];
let cart = [];

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {

  const { data, error } = await client
    .from("products")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  products = data || [];

  renderProducts(products);
}

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts(items) {

  const box = document.getElementById("products");

  if (!box) return;

  box.innerHTML = "";

  items.forEach((p) => {

    box.innerHTML += `
    
      <div class="card">

        <img
          src="${p.image || 'https://via.placeholder.com/300'}"
        >

        <h3>${p.name}</h3>

        <p>${p.description || ""}</p>

        <b>${p.price} ₽</b>

        <button onclick="addToCart(${p.id})">
          В корзину
        </button>

      </div>

    `;
  });
}

// =======================
// SEARCH
// =======================
function searchProducts() {

  const value =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(value)
  );

  renderProducts(filtered);
}

// =======================
// CART
// =======================
function addToCart(id) {

  const item =
    products.find((p) => p.id === id);

  if (!item) return;

  cart.push(item);

  renderCart();
}

function removeFromCart(index) {

  cart.splice(index, 1);

  renderCart();
}

// =======================
// RENDER CART
// =======================
function renderCart() {

  const box = document.getElementById("cart");

  if (!box) return;

  let total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  box.innerHTML = `
  
    <p>Товаров: ${cart.length}</p>

    <p><b>Итого: ${total} ₽</b></p>

    <button onclick="createOrder()">
      Оформить заказ
    </button>

    <hr>

  `;

  cart.forEach((item, index) => {

    box.innerHTML += `
    
      <div style="margin-bottom:10px">

        ${item.name}
        <br>

        ${item.price} ₽

        <br>

        <button onclick="removeFromCart(${index})">
          ❌ Удалить
        </button>

      </div>

    `;
  });
}

// =======================
// CREATE ORDER
// =======================
async function createOrder() {

  if (cart.length === 0) {
    alert("Корзина пустая");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const { error } = await client
    .from("orders")
    .insert([
      {
        items: cart,
        total: total
      }
    ]);

  if (error) {
    console.log(error);
    alert("Ошибка заказа");
    return;
  }

  alert("Заказ оформлен!");

  cart = [];

  renderCart();
}

// =======================
// INIT
// =======================
loadProducts();

renderCart();
