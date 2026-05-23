
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

  const fileName =
    Date.now() + "-" + file.name;

  // UPLOAD IMAGE
  const { error: uploadError } =
    await client.storage
      .from("products")
      .upload(fileName, file);

  if (uploadError) {
    console.log(uploadError);
    return;
  }

  const imageUrl =
    `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;

  // INSERT PRODUCT
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
// RENDER PRODUCTS
// =======================
function renderProducts(products) {

  const box =
    document.getElementById("admin-products");

  box.innerHTML = "";

  products.forEach((p) => {

    box.innerHTML += `
    
      <div class="card">

        <img
          src="${p.image}"
          style="
            width:100%;
            max-width:250px;
            border-radius:12px;
          "
        >

        <br><br>

        <input
          id="name-${p.id}"
          value="${p.name}"
        >

        <br><br>

        <input
          id="price-${p.id}"
          value="${p.price}"
        >

        <br><br>

        <textarea
          id="desc-${p.id}"
        >${p.description || ""}</textarea>

        <br><br>

        <button onclick="updateProduct(${p.id})">
          💾 Сохранить
        </button>

        <button onclick="deleteProduct(${p.id})">
          🗑 Удалить
        </button>

      </div>

      <br>
    `;
  });
}

// =======================
// UPDATE PRODUCT
// =======================
async function updateProduct(id) {

  const name =
    document.getElementById(`name-${id}`).value;

  const price =
    document.getElementById(`price-${id}`).value;

  const description =
    document.getElementById(`desc-${id}`).value;

  const { error } =
    await client
      .from("products")
      .update({
        name,
        price,
        description
      })
      .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  loadProducts();
}

// =======================
// DELETE PRODUCT
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
