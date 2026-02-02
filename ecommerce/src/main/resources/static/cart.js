const userId = localStorage.getItem("userId");
const cartItemsContainer = document.getElementById("cartItems");
const grandTotalEl = document.getElementById("grandTotal");

let cartItems = [];
let grandTotal = 0;

// Load cart items
function loadCart() {
    fetch(`http://localhost:8080/cart/${userId}`)
        .then(res => res.json())
        .then(items => {
            cartItems = items;
            renderCart();
        })
        .catch(err => console.error("Error loading cart:", err));
}

// Render cart items as cards
function renderCart() {
    cartItemsContainer.innerHTML = "";
    grandTotal = 0;

    if(cartItems.length === 0){
        cartItemsContainer.innerHTML = `<p>Your cart is empty 😢</p>`;
        grandTotalEl.innerText = `Total: ₹0`;
        return;
    }

    cartItems.forEach(item => {
        const product = item.product;
        const total = product.price * item.quantity;
        grandTotal += total;

        const card = document.createElement("div");
        card.className = "cart-card";
        card.innerHTML = `
            <img src="${product.image || 'default-product.jpg'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <div class="quantity-container">
                <label>Qty:</label>
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <p>Total: ₹${total.toFixed(2)}</p>
            <button onclick="removeItem(${item.id})">Remove</button>
        `;

        cartItemsContainer.appendChild(card);
    });

    grandTotalEl.innerText = `Total: ₹${grandTotal.toFixed(2)}`;
}

// Update quantity
function updateQuantity(cartItemId, newQty) {
    fetch(`http://localhost:8080/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(newQty) })
    })
    .then(res => res.json())
    .then(() => loadCart())
    .catch(err => console.error("Error updating quantity:", err));
}

// Remove item
function removeItem(cartItemId) {
    fetch(`http://localhost:8080/cart/remove/${cartItemId}`, { method: "DELETE" })
        .then(() => loadCart())
        .catch(err => console.error("Error removing item:", err));
}

// Place order
function placeOrder() {
    if(cartItems.length === 0){
        alert("Your cart is empty!");
        return;
    }

fetch(`http://localhost:8080/orders/place/${userId}`, {
    method: "POST"
})

        .then(res => {
            if(res.ok){
                alert("Order placed successfully ✅");
                cartItems = [];
                renderCart();
            } else {
                alert("Failed to place order ❌");
            }
        })
        .catch(err => console.error("Error placing order:", err));
}

// Initialize
loadCart();
