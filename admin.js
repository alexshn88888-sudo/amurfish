const SUPABASE_URL = "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function addProduct() {

  const file =
    document.getElementById("img").files[0];

  const reader = new FileReader();

  reader.onload = async function () {

    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("desc").value,
      image: reader.result,
      category: "fish"
    };

    const { error } = await client
      .from("products")
      .insert([product]);

    if (error) {
      console.log(error);
      alert("Ошибка");
      return;
    }

    alert("Товар добавлен!");
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
