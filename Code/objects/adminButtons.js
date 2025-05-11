// adminButtons.js
// By: Michael Goodwyn
// Last Modified: 5/10/2025
// Description: This file contains helper JS code for buttons in admin.ejs

// const vars holding button elements in admin.ejs
const assignClientButton = document.getElementById('assignClientButton');
const addEmployeeButton = document.getElementById('addEmployeeButton');
const removeEmployeeButton = document.getElementById('removeEmployeeButton');
const addNewClientButton = document.getElementById('addNewClientButton');
const removeClientButton = document.getElementById('removeClientButton');

// const vars holding div elements for hiding/showing content
const assignClientContent = document.getElementById("assignClient");
const addEmployeeContent = document.getElementById("addEmployee");
const removeEmployeeContent = document.getElementById("removeEmployee");
const addNewClientContent = document.getElementById("addNewClient");
const removeClientContent = document.getElementById("removeClient");

// Buttons for Action Event Submission
const addNewClient_buildButton = document.getElementById("addNewClient_buildButton");

// Initial information hiding until button press
assignClientContent.style.display = "none";
addEmployeeContent.style.display = "none";
removeEmployeeContent.style.display = "none";
addNewClientContent.style.display = "none";
removeClientContent.style.display = "none";

/*===
 Event Listeners showing/hiding content for assignClients, addEmployee,
 addNewClient, removeClient and removeEmployee functionalities in admin.ejs
===*/

assignClientButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = "block";
    addEmployeeContent.style.display = "none";
    removeEmployeeContent.style.display = "none";
    addNewClientContent.style.display = "none";
    removeClientContent.style.display = "none";
})
addEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = "none";
    addEmployeeContent.style.display = "block";
    removeEmployeeContent.style.display = "none";
    addNewClientContent.style.display = "none";
    removeClientContent.style.display = "none";
})
removeEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = "none";
    addEmployeeContent.style.display = "none";
    removeEmployeeContent.style.display = "block";
    addNewClientContent.style.display = "none";
    removeClientContent.style.display = "none";
})
addNewClientButton.addEventListener('click', () => {
    /* set removeClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = "none";
    addEmployeeContent.style.display = "none";
    removeEmployeeContent.style.display = "none";
    addNewClientContent.style.display = "block";
    removeClientContent.style.display = "none";
})
removeClientButton.addEventListener('click', () => {
    /* set removeClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = "none";
    addEmployeeContent.style.display = "none";
    removeEmployeeContent.style.display = "none";
    addNewClientContent.style.display = "none";
    removeClientContent.style.display = "block";
})

/*===
 Button Routing after Submitting an Action
===*/

// addNewClient Redirect to empty clientDetails form
addNewClient_buildButton.addEventListener('click', () => {
    // const newClient =
    fetch("/client", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({clientID: "new"})
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