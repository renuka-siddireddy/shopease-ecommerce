const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login again");
    window.location.href = "login.html";
}

// View elements
const viewName = document.getElementById("viewName");
const viewEmail = document.getElementById("viewEmail");
const viewPhone = document.getElementById("viewPhone");
const viewAddress = document.getElementById("viewAddress");

// Edit inputs
const avatar = document.getElementById("avatar");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

const editSection = document.getElementById("editSection");

// Load profile
fetch(`http://localhost:8080/users/${userId}`)
    .then(res => res.json())
    .then(user => {

        // View mode
        viewName.innerText = user.name || "-";
        viewEmail.innerText = user.email || "-";
        viewPhone.innerText = user.phone || "Not added";
        viewAddress.innerText = user.address || "Not added";

        // Edit mode inputs
        nameInput.value = user.name || "";
        emailInput.value = user.email || "";
        phoneInput.value = user.phone || "";
        addressInput.value = user.address || "";

        // Gmail-style avatar (SAFE)
        const firstLetter = (user.name && user.name.length > 0)
            ? user.name.charAt(0).toUpperCase()
            : "U";

        avatar.innerText = firstLetter;
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load profile");
    });

// Enable edit mode
function enableEdit() {
    editSection.style.display = "block";
}

// Update profile
function updateProfile() {
    const updatedUser = {};

    if (nameInput.value.trim() !== "") {
        updatedUser.name = nameInput.value;
    }

    if (phoneInput.value.trim() !== "") {
        updatedUser.phone = phoneInput.value;
    }

    if (addressInput.value.trim() !== "") {
        updatedUser.address = addressInput.value;
    }

    fetch(`http://localhost:8080/users/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    })
    .then(res => res.json())
    .then(() => {
        alert("Profile updated successfully ✅");
        location.reload();
    })
    .catch(err => console.error(err));
}
