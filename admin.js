const SUPABASE_URL =
  "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =======================
// ПАРОЛЬ
// =======================
const ADMIN_PASSWORD = "amurfish2026";

// =======================
// LOGIN
// =======================
function login() {

  const pass =
    document.getElementById("password").value;

  if (pass === ADMIN_PASSWORD) {

    document.getElementById("login-box")
      .style.display = "none";

    document.getElementById("admin-panel")
      .style.display = "block";

    loadProducts();

  } else {

    alert("Неверный пароль");

  }
}

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

  const file =
    document.getElementById("imageFile").files[0];

  if (!name || !price || !file) {
    return;
  }

  // ИМЯ ФАЙЛА
  const fileName =
    Date.now() + "-" + file.name;

  // UPLOAD
  const { error: uploadError } =
    await client.storage
      .from("products")
      .upload(fileName, file);

  if (uploadError) {
    console.log(uploadError);
    return;
  }

  // URL
  const imageUrl =
    `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;

  // INSERT
  const { error } =
    await client
      .from("products")
      .insert([
        {
          name,
          price,
          description,
          image: imageUrl,
          category: "fish"
        }
      ]);

  if (error) {
    console.log(error);
    return;
  }

  // CLEAR
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("imageFile").value = "";

  loadProducts();
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

  renderProducts(data);
}

// =======================
// RENDER
// =======================
function renderProducts(products) {

  const box =
    document.getElementById("admin-products");

  box.innerHTML = "";

  products.forEach((p) => {

    box.innerHTML += `
    
      <div class="card">

        <img src="${p.image}" />

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
// DELETE
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
