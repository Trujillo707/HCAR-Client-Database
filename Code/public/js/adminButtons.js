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
const assignClientSearchButton = document.getElementById('assignClientSearchButton');
const assignClientResult = document.getElementById('assignClientResult');

// Initializing admin content to invisible until button is pressed
assignClientContent.style.display = 'none';
addEmployeeContent.style.display = 'none';
removeEmployeeContent.style.display = 'none';
addNewClientContent.style.display = 'none';
removeClientContent.style.display = 'none';

// Event listeners for admin function buttons to show their content / hide the others
assignClientButton.addEventListener('click', () => {
    assignClientContent.style.display = 'block';
    addEmployeeContent.style.display = 'none';
    removeEmployeeContent.style.display = 'none';
    addNewClientContent.style.display = 'none';
    removeClientContent.style.display = 'none';
})

addEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = 'none';
    addEmployeeContent.style.display = 'block';
    removeEmployeeContent.style.display = 'none';
    addNewClientContent.style.display = 'none';
    removeClientContent.style.display = 'none';
})

removeEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = 'none';
    addEmployeeContent.style.display = 'none';
    removeEmployeeContent.style.display = 'block';
    addNewClientContent.style.display = 'none';
    removeClientContent.style.display = 'none';
})

addNewClientButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = 'none';
    addEmployeeContent.style.display = 'none';
    removeEmployeeContent.style.display = 'none';
    addNewClientContent.style.display = 'block';
    removeClientContent.style.display = 'none';
})

removeClientButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    assignClientContent.style.display = 'none';
    addEmployeeContent.style.display = 'none';
    removeEmployeeContent.style.display = 'none';
    addNewClientContent.style.display = 'none';
    removeClientContent.style.display = 'block';
})

/* event listeners for sub-divs in each admin function */

assignClientSearchButton.addEventListener('click', () => {
    assignClientResult.style.display = 'block';
})