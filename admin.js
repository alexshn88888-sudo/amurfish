function addProduct() {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const newProduct = {
    id: Date.now(),
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    description: document.getElementById("desc").value,
    image: document.getElementById("img").value
  };

  products.push(newProduct);

  localStorage.setItem("products", JSON.stringify(products));

  alert("Товар добавлен!");
}
