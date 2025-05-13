/*==========
    By: Michael Goodwyn, Justin Crittenden
    Last Modified: 4/18/2025

    caseNoteHandling.js --> routes buttons in the case note section of clientDetails.ejs
                            to their appropriate locations/functions (new, edit, view, download)
==========*/

// Event Listeners for New, Edit, View, and Download Buttons
// import {jsPDF} from "jspdf";
const newCaseNoteButton = document.getElementById("newCaseNote");
const vieweditCaseNoteButton = document.getElementById("vieweditCaseNote");
const downloadCaseNoteButton = document.getElementById("downloadCaseNote");
const deleteCaseNoteButton = document.getElementById("deleteCaseNote")
const caseNoteRows = document.querySelectorAll(".clickableRow");
const caseNoteTable = document.getElementById("caseNoteTable");
const dialogDelete = document.getElementById("dialogBox");
const yesDelete = document.getElementById("dialogBlack");
const noDelete = document.getElementById("dialogWhite");

// Selectable case note rows
caseNoteRows.forEach(row => {
    row.addEventListener("click", () => {
        // Remove selected class from any rows that have its
        let selectedRows = caseNoteTable.querySelectorAll(".selected");
        for (const selectedRow of selectedRows) {
            if (selectedRow !== row)
                selectedRow.classList.remove("selected");
        }
        // Add selected to the clicked row
        row.classList.toggle("selected");

        // If a row is selected
        if (row.classList.contains("selected"))
        {
            // Enable buttons
            vieweditCaseNoteButton.disabled = false;
            downloadCaseNoteButton.disabled = false;
            deleteCaseNoteButton.disabled = false;
        }
        else
        {
            // Disable buttons
            vieweditCaseNoteButton.disabled = true;
            downloadCaseNoteButton.disabled = true;
            deleteCaseNoteButton.disabled = true;
        }
    })
});

newCaseNoteButton.addEventListener("click", () => {
    const clientID = caseNoteTable.dataset.clientid;
    // let chosenRow = caseNoteTable.querySelector(".selected");
    // let nID = chosenRow.dataset.noteID;
    if (clientID == undefined || clientID == null) {
        alert("Weird, not getting the client ID.");
        return;
    }
    fetch("/caseNote", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({button: "new", noteID: 0, clientID: clientID})
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

vieweditCaseNoteButton.addEventListener("click", () => {
    const clientID = caseNoteTable.dataset.clientid;
    let chosenRow = caseNoteTable.querySelector(".selected");
    let noteID = Number(chosenRow.dataset.noteid);
    fetch("/caseNote", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({button: "viewedit", noteID: noteID, clientID: clientID})
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
})

downloadCaseNoteButton.addEventListener("click", () => {
    // let chosenRow = caseNoteTable.querySelector(".selected");
    // let nID = chosenRow.dataset.noteID;
    // fetch("/caseNote", {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({button: "download", noteID: nID, client: client})
    //     })
    //     .then(response => {
    //         // Check for errors, if ok then parse JSON
    //         if (!response.ok)
    //             throw new Error(`Error: ${response.status}`);
    //         return response.json();
    //     })
    //     .then(data => {
    //         if (data.redirect)
    //             window.location.href = data.redirect;
    //     }) 
    //     .catch(error => console.log("Error: ", error))
});


// Show dialog if user clicks delete
deleteCaseNoteButton.addEventListener("click", () => { dialogDelete.showModal(); });

// Event Listener for when user clicks yes to delete
yesDelete.addEventListener("click", () =>
{
    const clientID = Number(caseNoteTable.dataset.clientid);
    let chosenRow = caseNoteTable.querySelector(".selected");
    let noteID = Number(chosenRow.dataset.noteid);
    // Deletion logic
    fetch("/api/deleteCaseNote", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({noteID: noteID, clientID: clientID})
            })
            .then(response => {
                // Check for errors, if ok then parse JSON
                if (!response.ok)
                    throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Consider outputting message to screen
                console.log(data.message);
            }) 
            .catch(error => console.log("Error: ", error))

    // Take out selected row
    caseNoteTable.querySelector(".selected").remove();
    // Close dialog
    dialogDelete.close();
});

// Close dialog if user clicks no
noDelete.addEventListener("click", () => { dialogDelete.close(); });
