function updateNavbar() {
    const nav = document.getElementById("navLinks");
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (loggedIn) {
        nav.innerHTML = `
            <li>Home</li>
            <li>Products</li>
            <li onclick="goCart()">Cart</li>
            <li onclick="goOrders()">Orders</li>
            <li onclick="logout()">Logout</li>
        `;
    } else {
        nav.innerHTML = `
            <li>Home</li>
            <li>Products</li>
            <li onclick="goLogin()">Login</li>
            <li onclick="goRegister()">Register</li>
        `;
    }
}

function checkLogin() {
     if (localStorage.getItem("loggedIn") !== "true") {
         window.location.href = "login.html";
     }
 }

 function logout() {
     localStorage.clear();
     window.location.href = "index.html";
 }

 function goCart() {
     window.location.href = "cart.html";
 }

 function goOrders() {
     window.location.href = "orders.html";
 }
