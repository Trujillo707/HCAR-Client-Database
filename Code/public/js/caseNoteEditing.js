// Created by: Justin Crittenden
// Last Modified: May 12, 2025
// caseNoteEditing.js - Script for the caseNote.ejs file. 

const backButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

backButton.addEventListener("click", () => history.back());

// Event Listener for "Save"
saveButton.addEventListener("click", () => {
    alert("Saved!");
})