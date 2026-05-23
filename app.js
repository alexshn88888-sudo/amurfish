
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

// =======================
// INIT
// =======================
async function init() {

  await loadCategories();
  await loadProducts();
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {

  const { data, error } =
    await client
      .from("products")
      .select("*")
      .order("id", { ascending: false });

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

  if (!box) return;

  box.innerHTML =
    `<button onclick="filterByCategory('all')">Все</button>`;

  categories.forEach((c) => {

    box.innerHTML += `
      <button onclick="filterByCategory('${c.name}')">
        ${c.name}
      </button>
    `;
  });
}

// =======================
// FILTER
// =======================
function filterByCategory(category) {

  if (category === "all") {

    renderProducts(products);
    return;
  }

  const filtered =
    products.filter(
      p => p.category === category
    );

  renderProducts(filtered);
}

// =======================
// SORT PRICE
// =======================
function sortPrice(type) {

  let sorted = [...products];

  if (type === "cheap") {

    sorted.sort((a, b) =>
      Number(a.price) - Number(b.price)
    );
  }

  if (type === "expensive") {

    sorted.sort((a, b) =>
      Number(b.price) - Number(a.price)
    );
  }

  renderProducts(sorted);
}

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts(list) {

  const box =
    document.getElementById("products");

  box.innerHTML = "";

  list.forEach((p) => {

    box.innerHTML += `
      <div class="card">

        <img src="${p.image}" />

        <h3>${p.name}</h3>

        <p>${p.description || ""}</p>

        <b>${p.price} ₽</b>

        <button onclick="addToCart('${p.name}', ${p.price})">
          В корзину
        </button>

      </div>
    `;
  });
}

// =======================
// CART (если есть)
// =======================
function addToCart(name, price) {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({ name, price });

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Добавлено в корзину");
}

// =======================
// START
// =======================
init();
