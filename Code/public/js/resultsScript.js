const backButton = document.getElementById("goBackButton");
const selectButton = document.getElementById("selectButton");
const clientRows = document.querySelectorAll(".clickableRow");
const clientTableBody = document.getElementById("clientTableBody");

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
