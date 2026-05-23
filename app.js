
const SUPABASE_URL =
  "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let products = [];
let categories = [];
let currentCategory = "all";

// =======================
// INIT
// =======================
async function init() {

  await loadCategories();
  await loadProducts();
  loadCart();
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {

  const { data, error } =
    await client
      .from("products")
      .select("*")
      .order("id", {
        ascending: false
      });

  if (error) {
    console.log(error);
    return;
  }

  products = data;

  renderProducts(products);
}

// =======================
// LOAD CATEGORIES
// =======================
async function loadCategories() {

  const { data, error } =
    await client
      .from("categories")
      .select("*");

  if (error) {
    console.log(error);
    return;
  }

  categories = data;

  renderCategories();
}

// =======================
// RENDER CATEGORIES
// =======================
function renderCategories() {

  const box =
    document.getElementById("categories");

  box.innerHTML = `
    <button onclick="filterByCategory('all')">
      Все
    </button>
  `;

  categories.forEach((c) => {

    box.innerHTML += `
      <button onclick="filterByCategory('${c.name}')">
        ${c.name}
      </button>
    `;
  });
}

// =======================
// CATEGORY FILTER
// =======================
function filterByCategory(category) {

  currentCategory = category;

  searchProducts();
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

  let filtered = [...products];

  // CATEGORY
  if (currentCategory !== "all") {

    filtered = filtered.filter(
      p => p.category === currentCategory
    );
  }

  // SEARCH
  filtered = filtered.filter((p) => {

    const name =
      (p.name || "").toLowerCase();

    const desc =
      (p.description || "").toLowerCase();

    return (
      name.includes(value) ||
      desc.includes(value)
    );
  });

  renderProducts(filtered);
}

// =======================
// SORT PRICE
// =======================
function sortPrice(type) {

  let filtered = [...products];

  // CATEGORY
  if (currentCategory !== "all") {

    filtered = filtered.filter(
      p => p.category === currentCategory
    );
  }

  // SEARCH
  const value =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  filtered = filtered.filter((p) => {

    const name =
      (p.name || "").toLowerCase();

    const desc =
      (p.description || "").toLowerCase();

    return (
      name.includes(value) ||
      desc.includes(value)
    );
  });

  // SORT
  if (type === "cheap") {

    filtered.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );
  }

  if (type === "expensive") {

    filtered.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );
  }

  renderProducts(filtered);
}

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts(list) {

  const box =
    document.getElementById("products");

  box.innerHTML = "";

  // NOTHING FOUND
  if (list.length === 0) {

    box.innerHTML = `
      <div class="card">

        <h2>
          Ничего не найдено 😢
        </h2>

      </div>
    `;

    return;
  }

  list.forEach((p) => {

    box.innerHTML += `
    
      <div class="card">

        <img src="${p.image}" />

        <h3>${p.name}</h3>

        <p>${p.description || ""}</p>

        <b>${p.price} ₽</b>

        <button onclick="
          addToCart(
            '${p.name}',
            '${p.price}'
          )
        ">
          В корзину
        </button>

      </div>
    `;
  });
}

// =======================
// CART
// =======================
function addToCart(name, price) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  cart.push({
    name,
    price
  });

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  loadCart();

  alert("Товар добавлен");
}

// =======================
// LOAD CART
// =======================
function loadCart() {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const box =
    document.getElementById("cart");

  box.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    total += Number(item.price);

    box.innerHTML += `
    
      <div class="cart-item">

        <p>${item.name}</p>

        <b>${item.price} ₽</b>

        <br>

        <button onclick="removeCart(${index})">
          ❌
        </button>

      </div>

      <br>
    `;
  });

  box.innerHTML += `
    <hr><br>

    <h3>
      Итого: ${total} ₽
    </h3>
  `;
}

// =======================
// REMOVE CART
// =======================
function removeCart(index) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  loadCart();
}

// =======================
// CHECKOUT
// =======================
function checkout() {

  alert(
    "Заказ оформлен! Мы свяжемся с вами."
  );

  localStorage.removeItem("cart");

  loadCart();
}

// =======================
// START
// =======================
init();
