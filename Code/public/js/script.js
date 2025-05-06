// Justin Crittenden - February 18, 2025
const form = document.getElementById("login-form");
const username = document.getElementById("user");
const password = document.getElementById("pass");

const isValid = (event) => {
    // Grab and sanitize values
    let user = username.value;
    let pass = password.value;

    // Match login info with accounts


    if (!user || !pass) {
        alert("Please enter a value for the username and password!");
        event.preventDefault();
    }
}

form.addEventListener("submit", isValid);