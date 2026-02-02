const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
}

fetch(`http://localhost:8080/orders/${userId}`)
    .then(res => res.json())
    .then(orders => {
        const tbody = document.getElementById("ordersBody");
        tbody.innerHTML = "";

        if (!orders || orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No orders found</td></tr>`;
            return;
        }

        orders.forEach(order => {
            const status = order.status || "PLACED";

            tbody.innerHTML += `
                <tr>
                    <td>${order.product?.name || "N/A"}</td>
                    <td>₹ ${order.product?.price || 0}</td>
                    <td>${order.quantity || 1}</td>
                    <td>${order.deliveryDate || "Pending"}</td>
                    <td class="status ${status.toLowerCase()}">${status}</td>
                    <td>
                        ${status === "PLACED"
                            ? `<button class="cancel-btn" onclick="cancelOrder(${order.id})">Cancel</button>`
                            : "—"}
                    </td>
                </tr>
            `;
        });
    });

function cancelOrder(orderId) {
    if (!confirm("Cancel this order?")) return;

    fetch(`http://localhost:8080/orders/cancel/${orderId}`, {
        method: "PUT"
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        location.reload();
    });
}
