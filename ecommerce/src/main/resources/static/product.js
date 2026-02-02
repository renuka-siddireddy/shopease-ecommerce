const productDetails = document.getElementById("productDetails");

// 1️⃣ Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    productDetails.innerHTML = "<p>Product not found</p>";
}

// 2️⃣ Fetch product by ID
fetch(`http://localhost:8080/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        productDetails.innerHTML = `
            <div class="product-container">
                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <h3>₹${product.price}</h3>

                    <button onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    })
    .catch(err => {
        console.error(err);
        productDetails.innerHTML = "<p>Error loading product</p>";
    });

// 3️⃣ Add to Cart function (THIS WAS MISSING OR WRONG)
function addToCart(productId) {
    const userId = localStorage.getItem("userId"); // or however you store it

    if (!userId) {
        alert("Please login first");
        return;
    }

    fetch(`http://localhost:8080/cart/add/${userId}/${productId}`, {
        method: "POST"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to add to cart");
        }
        return res.text();
    })
    .then(msg => {
        alert("Product added to cart 🛒");
    })
    .catch(err => {
        console.error(err);
        alert("Error adding product");
    });
}
