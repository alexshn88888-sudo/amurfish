const SUPABASE_URL = "https://ombhbcsjwwnvqcwwytql.supabase.co";

const SUPABASE_KEY = "ВСТАВЬ_СВОЙ_ANON_KEY";

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
