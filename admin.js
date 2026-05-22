function addProduct() {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const file = document.getElementById("img").files[0];

  const reader = new FileReader();

  reader.onload = function () {

    const newProduct = {
      id: Date.now(),
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("desc").value,
      image: reader.result
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    alert("Товар добавлен!");
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
