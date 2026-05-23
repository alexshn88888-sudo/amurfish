const SUPABASE_URL = "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function addProduct() {

  const name =
    document.getElementById("name").value;

  const price =
    document.getElementById("price").value;

  const description =
    document.getElementById("desc").value;

  const file =
    document.getElementById("img").files[0];

  // ЕСЛИ ФОТО НЕ ВЫБРАНО
  if (!file) {

    const { error } = await client
      .from("products")
      .insert([
        {
          name,
          price,
          description,
          image: "",
          category: "fish"
        }
      ]);

    if (error) {
      console.log(error);
      alert("Ошибка добавления товара");
      return;
    }

    alert("Товар добавлен!");
    return;
  }

  // ЕСЛИ ЕСТЬ ФОТО
  const reader = new FileReader();

  reader.onload = async function (e) {

    const imageBase64 = e.target.result;

    const { error } = await client
      .from("products")
      .insert([
        {
          name,
          price,
          description,
          image: imageBase64,
          category: "fish"
        }
      ]);

    if (error) {
      console.log(error);
      alert("Ошибка добавления товара");
      return;
    }

    alert("Товар добавлен!");
  };

  reader.readAsDataURL(file);
}
