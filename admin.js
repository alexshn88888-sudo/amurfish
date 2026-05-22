
function getProducts(){
  return JSON.parse(localStorage.getItem('products') || '[]');
}

function saveProducts(p){
  localStorage.setItem('products', JSON.stringify(p));
  render();
}

function addProduct(){
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const desc = document.getElementById('desc').value;

  const products = getProducts();
  products.push({name, price, desc});
  saveProducts(products);
}

function deleteProduct(i){
  const products = getProducts();
  products.splice(i,1);
  saveProducts(products);
}

function render(){
  const list = document.getElementById('list');
  const products = getProducts();

  list.innerHTML = products.map((p,i)=>
    `<div>
      <b>${p.name}</b> - ${p.price}
      <button onclick="deleteProduct(${i})">Удалить</button>
    </div>`
  ).join('');
}

render();
