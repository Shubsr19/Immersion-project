let currentProducts = [];

async function fetchProducts(query = '') {
  const url = query
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
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Price:</strong> $${product.price}</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
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
  populateFilters(currentProducts);
  applyFilters(); // Apply filters and sort
}

function applySort(products) {
  const sortValue = document.getElementById('sortSelect').value;
  let sorted = [...products];

  switch (sortValue) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating-asc':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sorted;
}

function applyFilters() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;

  let filtered = [...currentProducts];

  if (brand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }

  const sorted = applySort(filtered);
  renderProducts(sorted);
}

function populateFilters(products) {
  const brandSelect = document.getElementById('brandFilter');
  const brands = [...new Set(products.map(p => p.brand))];

  brandSelect.innerHTML = `<option value="">Filter by Brand</option>`;
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });
}

window.onload = async () => {
  currentProducts = await fetchProducts();
  populateFilters(currentProducts);
  applyFilters();
};
