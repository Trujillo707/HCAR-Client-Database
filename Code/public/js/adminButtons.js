/*===
    adminButtons.js
    By: Michael Goodwyn
    Last Modified: 5/11/2025

    Description: This file contains the event listeners for the admin buttons on the admin.ejs page.
===*/

// Admin function button declarations
const assignClientButton = document.getElementById('assignClientButton');
const addEmployeeButton = document.getElementById('addEmployeeButton');
const removeEmployeeButton = document.getElementById('removeEmployeeButton');
const addNewClientButton = document.getElementById('addNewClientButton');
const removeClientButton = document.getElementById('removeClientButton');

// Admin function div declarations
const assignClientContent = document.getElementById('assignClient');
const addEmployeeContent = document.getElementById('addEmployee');
const removeEmployeeContent = document.getElementById('removeEmployee');
const addNewClientContent = document.getElementById('addNewClient');
const removeClientContent = document.getElementById('removeClient');

// Sub-divs and buttons for admin functions

const removeClientResult = document.getElementById('removeClientSearchResults');
const removeEmployeeResult = document.getElementById('removeEmplSearchResults');

// array holding all important block elements for information hiding:
const adminContent = [
    assignClientContent,
    addEmployeeContent,
    removeEmployeeContent,
    addNewClientContent,
    removeClientContent,
    // assignClientResult,
    // removeClientResult
];

console.log(adminContent);

// method to set all admin content to invisible until button is pressed
function hideAdminContent() {
    adminContent.forEach((element) => {
        element.style.display = "none";
    });
}

// initializing hidden content:
window.onload = () => {
    hideAdminContent();
}

// Event listeners for admin function buttons to show their content / hide the others
assignClientButton.addEventListener('click', () => {
    hideAdminContent();
    assignClientContent.style.display = 'block';
})

addEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    hideAdminContent();
    addEmployeeContent.style.display = 'block';
})

removeEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    hideAdminContent();
    removeEmployeeContent.style.display = 'block';
})

addNewClientButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    hideAdminContent();
    addNewClientContent.style.display = 'block';
})

removeClientButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    hideAdminContent();
    removeClientContent.style.display = 'block';
})

/* event listeners for sub-divs in each admin function (only reachable from an admin action) */

assignClientSearchButton.addEventListener('click', () => {
    assignClientResult.style.display = 'block';
    window.location.href = '/admin/assign';
})


// addEmployeeButton = document.addEventListener('click', () => {
//     window.location.href = '/admin/addempl';
// })