const API_URL = "http://localhost:8080/products";

document.addEventListener("DOMContentLoaded", loadProducts);

// LOAD PRODUCTS
function loadProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(products => {
            const tbody = document.getElementById("productsTableBody");
            tbody.innerHTML = "";

            products.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${p.image}" width="60"></td>
                        <td>${p.name}</td>

                        <td>
                            <input type="number" id="price-${p.id}" value="${p.price}">
                        </td>

                        <td>
                            <input type="number" id="stock-${p.id}" value="${p.stock}">
                        </td>

                        <td>${p.category}</td>

                        <td>
                            <button onclick="updateProduct(${p.id})">Update</button>
                            <button onclick="deleteProduct(${p.id})" style="background:red;color:white;">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error loading products:", err));
}

// ADD PRODUCT (OLD LOGIC KEPT)
function addProduct() {
    const product = {
        name: document.getElementById("name").value,
        price: parseFloat(document.getElementById("price").value),
        stock: parseInt(document.getElementById("stock").value),
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        image: document.getElementById("image").value
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    })
    .then(() => {
        alert("Product Added!");
        loadProducts();
    });
}

// UPDATE PRICE & STOCK ONLY
function updateProduct(id) {
    const updatedData = {
        price: parseFloat(document.getElementById(`price-${id}`).value),
        stock: parseInt(document.getElementById(`stock-${id}`).value)
    };

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(() => {
        alert("Updated Successfully!");
        loadProducts();
    });
}

// DELETE PRODUCT
function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Product Deleted!");
        loadProducts();
    });
}
