
const SUPABASE_URL =
  "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmhiY3Nqd3dudnFjd3d5dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4MzQsImV4cCI6MjA5NTAyMTgzNH0.3y6c1iMR3wHZejYry9GvktO7g2rRUVXmdIu8aLhkdO8";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================
// ДОБАВЛЕНИЕ ТОВАРА
// ======================
async function addProduct() {

  const name =
    document.getElementById("name").value;

  const price =
    document.getElementById("price").value;

  const description =
    document.getElementById("desc").value;

  // КАРТИНКА ПО УМОЛЧАНИЮ
  const image =
    "https://images.unsplash.com/photo-1544943910-4c1dc44aab44";

  // ПРОВЕРКА ПОЛЕЙ
  if (!name || !price) {

    console.log("Заполни поля");

    return;
  }

  // ДОБАВЛЕНИЕ В SUPABASE
  const { data, error } =
    await client
      .from("products")
      .insert([
        {
          name: name,
          price: price,
          description: description,
          image: image,
          category: "fish"
        }
      ]);

  // ОШИБКА
  if (error) {

    console.log(error);

    return;
  }

  // УСПЕХ
  console.log("Товар добавлен");

  // ОЧИСТКА ПОЛЕЙ
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("desc").value = "";

  // ОБНОВЛЕНИЕ СТРАНИЦЫ
  location.reload();
}
