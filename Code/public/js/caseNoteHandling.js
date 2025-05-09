/*==========
    By: Michael Goodwyn
    Last Modified: 4/18/2025

    caseNoteHandling.js --> routes buttons in the case note section of clientDetails.ejs
                            to their appropriate locations/functions (new, edit, view, download)
==========*/

// Event Listeners for New, Edit, View, and Download Buttons
// import {jsPDF} from "jspdf";

const newCaseNoteButton = document.getElementById("newCaseNote");
const editCaseNoteButton = document.getElementById("editCaseNote");
const viewCaseNoteButton = document.getElementById("viewCaseNote");
const downloadCaseNoteButton = document.getElementById("downloadCaseNote");
const caseNoteRows = document.querySelectorAll(".clickableRow");
const caseNoteTable = document.querySelector(".caseNoteTable");

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
            editCaseNoteButton.disabled = false;
            viewCaseNoteButton.disabled = false;
            downloadCaseNoteButton.disabled = false;
        }
        else
        {
            // Disable buttons
            editCaseNoteButton.disabled = true;
            viewCaseNoteButton.disabled = true;
            downloadCaseNoteButton.disabled = true;
        }
    })
});

// Event Listener for New Case Note button
newCaseNoteButton.addEventListener("click", () => {
    // api to create a new case note

    // COMPLETE THIS: Probably need to send client ID too
    fetch("/caseNote", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({caseNoteID: 0})
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
    window.location.href='/caseNote';    // <-- location for new case note
});

// Event Listener for Edit Case Note button
editCaseNoteButton.addEventListener("click", () => {
    const selectedNote = caseNoteTable.querySelector(".selected");
    window.location.href='/caseNote'
});

// Event Listener for View Case Note button
viewCaseNoteButton.addEventListener("click", () => {
    window.location.href='/caseNote'
});

// Event Listener for Download Case Note button
downloadCaseNoteButton.addEventListener("click", () => {
    window.location.href='/caseNote'
});

/*
    - if no casenote selected, then edit/view/download buttons are dim
    - if casenote selected, edit/view/download buttons are active
    - new casenote button will route to a new empty casenote object, only
        saved when employee hits save button in note
    - edit will load a casenote editable by staff
    - view will show an uneditable casenote
 */



// downloadCaseNoteButton.addEventListener("click", () => {
//     var caseNoteDocument = document.createElement('a');
//     caseNoteDocument.href='/caseNote.ejs';
//
//     // const { jsPDF } = require("jspdf");
//     //
//     // const doc = new jsPDF();
//     // doc.text("hello world", 10, 10);
//     // doc.save("a4.pdf");
//
//     caseNoteDocument.download = 'file.pdf';
//     caseNoteDocument.dispatchEvent(new MouseEvent('click'));
// });