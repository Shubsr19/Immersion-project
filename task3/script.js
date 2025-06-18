let currentProducts = [];

async function fetchProducts(query = '') {
  let url = query
    ? `https://dummyjson.com/products/search?q=${query}`
    : `https://dummyjson.com/products`;

  const res = await fetch(url);
  const data = await res.json();
  return data.products;
}

function renderProducts(products) {
  const container = document.getElementById('productList');
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h4>${product.title}</h4>
      <p>Price: $${product.price}</p>
      <p>Rating: ${product.rating}</p>
    `;
    container.appendChild(card);
  });
}

async function searchProducts() {
  const input = document.getElementById('searchInput').value.trim();

  if (!input) {
    alert('Search field cannot be empty.');
    return;
  }

  currentProducts = await fetchProducts(input);
  applySort();  
}

function applySort() {
  const sortValue = document.getElementById('sortSelect').value;
  let sortedProducts = [...currentProducts];

  switch (sortValue) {
    case 'price-asc':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating-asc':
      sortedProducts.sort((a, b) => a.rating - b.rating);
      break;
    case 'rating-desc':
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
  }

  renderProducts(sortedProducts);
}

window.onload = async () => {
  currentProducts = await fetchProducts();
  applySort();
};
