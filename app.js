const SUPABASE_URL =
  "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client =
  supabase.createClient(
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
// FILTER CATEGORY
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
// SORT
// =======================
function sortPrice(type) {

  let filtered = [...products];

  if (currentCategory !== "all") {

    filtered = filtered.filter(
      p => p.category === currentCategory
    );
  }

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

  if (list.length === 0) {

    box.innerHTML = `
      <div class="card">
        <h2>Ничего не найдено 😢</h2>
      </div>
    `;

    return;
  }

  list.forEach((p) => {

    const oldPrice =
      p.old_price
      ? `<span class="old-price">${p.old_price} ₽</span>`
      : "";

    const badge =
      p.badge
      ? `<div class="badge">${p.badge}</div>`
      : "";

    box.innerHTML += `
    
      <div class="card">

        ${badge}

        <button
          class="fav-btn"
          onclick="toggleFavorite('${p.id}')"
        >
          ❤️
        </button>

        <img src="${p.image}" />

        <h3>${p.name}</h3>

        <p>${p.description || ""}</p>

        <div class="price-box">

          <b>${p.price} ₽</b>

          ${oldPrice}

        </div>

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
// FAVORITES
// =======================
function toggleFavorite(id) {

  let favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  if (favorites.includes(id)) {

    favorites =
      favorites.filter(
        item => item !== id
      );

  } else {

    favorites.push(id);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

// =======================
// CART
// =======================
function addToCart(name, price) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const existing =
    cart.find(
      item => item.name === name
    );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      name,
      price,
      quantity: 1
    });
  }

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

    total +=
      Number(item.price) *
      item.quantity;

    box.innerHTML += `
    
      <div class="cart-item">

        <p>
          ${item.name}
          × ${item.quantity}
        </p>

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
    "Заказ оформлен!"
  );

  localStorage.removeItem("cart");

  loadCart();
}

// =======================
// START
// =======================
init();
