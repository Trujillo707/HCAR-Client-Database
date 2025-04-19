// Justin Crittenden
// Last Modified: March 27: 2025

// Set Up Event Listener for More Options Button

const moreOptionsButton = document.getElementById("moreOptions");
const searchContainer = document.getElementById("searchContainer");
const form = document.getElementById("searchForm");

moreOptionsButton.addEventListener("click", () => {
    // Add CSS class for additional options + animation 

    // 'More Options' has been clicked
    if (searchContainer.classList.toggle("extend"))
    {
        // Relocate options button and show new fields
        moreOptionsButton.classList.toggle("extend");
        Array.from(searchContainer.children).forEach((child) => {
            if (child.classList.contains("hidden")) {
                child.style.display = "block"; // Show div
            }
        });
        moreOptionsButton.querySelector("#buttonText").textContent = "Less Options";
        moreOptionsButton.querySelector("#optionsIcon").src = "icons/chevron-double-up.svg"
    }
    // 'Less Options' has been clicked
    else
    {
        moreOptionsButton.classList.toggle("extend");
        Array.from(searchContainer.children).forEach((child) => {
            if (child.classList.contains("hidden")) {
                child.style.display = "none"; // Hide div
            }
        });
        moreOptionsButton.querySelector("#buttonText").textContent = "More Options";
        moreOptionsButton.querySelector("#optionsIcon").src = "icons/chevron-double-down.svg"
    }
});

// form.addEventListener("submit", (e) => {
//     // searchContainer.forEach((div) => {
//     //     // If there's a value in the search field
//     //     if (div.children.item(1).value)
//     //     {
//     //         // Send query to DB with where clause LIKE "%val%"
//     //     }
//     // });
//     e.preventDefault();
//     console.log("Event Listener!");
//     setTimeout(() =>
//     {
//         form.submit();
//     }, 10);
// });