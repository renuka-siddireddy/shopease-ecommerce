// =====================
// CAROUSEL
// =====================
let slideIndex = 0;
autoSlides();

function autoSlides() {
    const slides = document.getElementsByClassName("slide");
    if (!slides.length) return;

    for (let slide of slides) slide.style.display = "none";
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "block";
    setTimeout(autoSlides, 3500);
}

// =====================
// GLOBALS
// =====================
let allProducts = [];
const container = document.getElementById("product-list");

// =====================
// LOAD PRODUCTS
// =====================
fetch("http://localhost:8080/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
        updateCartCount();
    })
    .catch(err => console.error("Product load error:", err));

// =====================
// RENDER PRODUCTS
// =====================
function renderProducts(products) {
    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No products found</p>";
        return;
    }

    products.forEach(p => {
        container.innerHTML += `
            <div class="card" onclick="location.href='product.html?id=${p.id}'">
                <img src="${p.image || 'laptop.jpg'}"
                     onerror="this.src='laptop.jpg'">
                <h4>${p.name}</h4>
                <p class="price">₹ ${p.price.toLocaleString('en-IN')}</p>
                <button onclick="event.stopPropagation(); addToCart(${p.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// =====================
// SEARCH PRODUCTS
// =====================
function searchProducts() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const query = input.value.toLowerCase();

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
    );

    renderProducts(filtered);
}

// =====================
// ADD TO CART
// =====================
function addToCart(productId) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    fetch(`http://localhost:8080/cart/add/${userId}/${productId}`, {
        method: "POST"
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to add to cart");
        return res.text();
    })
    .then(() => {
        alert("Added to cart ✅");
        updateCartCount();
    })
    .catch(err => alert(err.message));
}

// =====================
// UPDATE CART COUNT
// =====================
function updateCartCount() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/cart/${userId}`)
        .then(res => res.ok ? res.json() : [])
        .then(items => {
            const cartLink = document.getElementById("cartCount");
            if (cartLink) {
                cartLink.innerText = `Cart (${items.length})`;
            }
        })
        .catch(() => console.log("Cart count error"));
}

// =====================
// LOGOUT
// =====================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
