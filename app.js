
function getProducts(){
  return JSON.parse(localStorage.getItem('products') || '[]');
}

function render(){
  const catalog = document.getElementById('catalog');
  if(!catalog) return;
  const products = getProducts();
  catalog.innerHTML = products.map(p =>
    `<div class="card">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <b>${p.price}</b>
      <button>В корзину</button>
    </div>`
  ).join('');
}

render();
