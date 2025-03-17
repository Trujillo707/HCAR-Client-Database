// Justin Crittenden - February 18, 2025
const form = document.getElementById("login-form");
const username = document.getElementById("user");
const password = document.getElementById("pass");

const isValid = () => {
    // Grab and sanitize values
    let user = username.value;
    let pass = password.value;

    // Match login info with accounts

    // Display 'Correct' if user and pass are valid
    if (user === "Hello" && pass === "World")
        alert("Hello World!");
    else if (!user && !pass)
        alert("Please enter a value for the username and password!");
    else   
        alert("Not what I'm looking for...");
}

form.addEventListener("submit", isValid);