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

newCaseNoteButton.addEventListener("click", () => {
    // api to create a new case note

    window.location.href='/caseNote'}); // <-- location for new case note

editCaseNoteButton.addEventListener("click", () => {window.location.href='/caseNote'});
viewCaseNoteButton.addEventListener("click", () => {window.location.href='/caseNote'});

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