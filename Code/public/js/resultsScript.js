const backButton = document.getElementById("goBackButton");
const selectButton = document.getElementById("selectButton");
const clientRows = document.querySelectorAll("#clientRow");
const clientTableBody = document.getElementById("clientTableBody");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const oldURL = new URL(window.location.href);
const searchString = new URLSearchParams(oldURL.search);
let currentPage = parseInt(searchString.get("page")) || 1;


if (clientRows.length < 15){
    nextButton.disabled = true;
    nextButton.style.cursor = "not-allowed";
}
if (currentPage <= 1){
    prevButton.disabled = true;
    prevButton.style.cursor = "not-allowed";
}

// Event Listener for Back Button
backButton.addEventListener("click", () => history.back());

// Add listeners for Client Rows
clientRows.forEach(row => {
    row.addEventListener("click", () => {
        // Remove selected class from any rows that have its
        let selectedRows = clientTableBody.querySelectorAll(".selected");
        for (const selectedRow of selectedRows) {
            if (selectedRow !== row)
                selectedRow.classList.remove("selected");
        }
        // Add selected to the clicked row
        row.classList.toggle("selected");
    })
});
// document.addEventListener("DOMContentLoaded", () => {
//     clientTableBody.addEventListener("click", (e) => {
//     // Remove selected class from any rows that have its
//     console.log("Trigged event listener for table");
//     let selectedRows = clientTableBody.filter(row => row.classList.contains("selected"));
//     for (const row of selectedRows) {
//         row.classList.remove("selected");
//     }
//     // Add selected to the clicked row
//     let selectedRow = e.target.closest("#clientRow");
//     if (selectedRow)
//         selectedRow.classList.toggle("selected");
//     })
// })


// Event Listener for Select Button
// FIX ME
selectButton.addEventListener("click", () => {
    const selectedClient = clientTableBody.querySelector(".selected");
    if (!selectedClient) 
    {
        alert("Please select a client to view");
        return;
    }
    fetch("/client", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({clientID: selectedClient.dataset.id})
    })
    .then(response => {
        // Check for errors, if ok then parse JSON
        if (!response.ok)
            throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.redirect)
            window.location.href = data.redirect;
    })  
    .catch(error => console.log("Error: ", error))
});

/**
 * Event Listener for Previous Button
 */
prevButton.addEventListener("click", () => {
    if (currentPage > 1){
        currentPage--;
        searchString.set("page", currentPage.toString());
        oldURL.search = searchString.toString();
        window.location.replace(oldURL);
    }
});

nextButton.addEventListener("click", ()=>{
    if (clientRows.length === 15){
        currentPage++;
        searchString.set("page", currentPage.toString());
        oldURL.search = searchString.toString();
        window.location.replace(oldURL);
    }
})

