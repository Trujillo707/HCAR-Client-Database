// Justin Crittenden
// Last Modified: March 24: 2025

// Set Up Event Listeners for Home Buttons
const quickViewButton = document.getElementById("quickViewButton");
const searchButton = document.getElementById("searchButton");
const reportsButton = document.getElementById("reportsButton");

quickViewButton.addEventListener("click", () => {window.location.href='/results/all'});
searchButton.addEventListener("click", () => {window.location.href='/search'});
reportsButton.addEventListener("click", () => {window.location.href='/reports'});
