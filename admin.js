
const SUPABASE_URL =
  "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =======================
// ДОБАВИТЬ ТОВАР
// =======================
async function addProduct() {

  const name =
    document.getElementById("name").value;

  const price =
    document.getElementById("price").value;

  const description =
    document.getElementById("desc").value;

  const image =
    document.getElementById("image").value;

  if (!name || !price) {
    return;
  }

  const { error } = await client
    .from("products")
    .insert([
      {
        name,
        price,
        description,
        image,
        category: "fish"
      }
    ]);

  if (error) {
    console.log(error);
    return;
  }

  // ОЧИСТКА
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("image").value = "";

  loadProducts();
}

// =======================
// ЗАГРУЗИТЬ ТОВАРЫ
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

  renderProducts(data);
}

// =======================
// ПОКАЗАТЬ ТОВАРЫ
// =======================
function renderProducts(products) {

  const box =
    document.getElementById("admin-products");

  box.innerHTML = "";

  products.forEach((p) => {

    box.innerHTML += `
    
      <div class="card">

        <img
          src="${p.image || 'https://via.placeholder.com/300'}"
        >

        <h3>${p.name}</h3>

        <p>${p.description || ""}</p>

        <b>${p.price} ₽</b>

        <br><br>

        <button onclick="deleteProduct(${p.id})">
          🗑 Удалить
        </button>

      </div>

      <br>

    `;
  });
}

// =======================
// УДАЛИТЬ ТОВАР
// =======================
async function deleteProduct(id) {

  const { error } =
    await client
      .from("products")
      .delete()
      .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  loadProducts();
}

// =======================
// INIT
// =======================
loadProducts();
