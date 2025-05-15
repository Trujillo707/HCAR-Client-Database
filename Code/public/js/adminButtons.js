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
const resetPasswordButton = document.getElementById('resetPasswordButton');

// Admin function div declarations
const assignClientContent = document.getElementById('assignClient');
const addEmployeeContent = document.getElementById('addEmployee');
const removeEmployeeContent = document.getElementById('removeEmployee');
const addNewClientContent = document.getElementById('addNewClient');
const removeClientContent = document.getElementById('removeClient');
const resetPasswordContent = document.getElementById('resetPassword');


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
    addEmployeeContent.style.display = 'none';
    removeEmployeeContent.style.display = 'none';
    addNewClientContent.style.display = 'none';
    removeClientContent.style.display = 'none';
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

resetPasswordButton.addEventListener('click', () => {
  assignClientContent.style.display    = 'none';
  addEmployeeContent.style.display     = 'none';
  removeEmployeeContent.style.display  = 'none';
  addNewClientContent.style.display    = 'none';
  removeClientContent.style.display    = 'none';
  resetPasswordContent.style.display   = 'block';
});

/* event listeners for sub-divs in each admin function (only reachable from an admin action) */

assignClientSearchButton.addEventListener('click', () => {
    assignClientResult.style.display = 'block';
    window.location.href = '/admin/assign';
})


// addEmployeeButton = document.addEventListener('click', () => {
//     window.location.href = '/admin/addempl';
// })


resetPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  resetPasswordResult.textContent = '';  // clear previous

  const username = document.getElementById('resetUsername').value.trim();
  if (!username) {
    resetPasswordResult.textContent = 'Please enter a username.';
    return;
  }

  try {
    const res = await fetch(resetPasswordForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const json = await res.json();

    // 1) always check for Error field first
    if (json.Error) {
      resetPasswordResult.textContent = json.Error;
      return;
    }

    // 2) then check HTTP status
    if (!res.ok) {
      resetPasswordResult.textContent = json.message || 'An unexpected error occurred.';
      return;
    }

    // 3) success!
    resetPasswordResult.innerHTML = `
      <p>Password reset successfully!</p>
      <p><strong>New password:</strong> <code>${json.password}</code></p>
    `;
  }
  catch (err) {
    console.error(err);
    resetPasswordResult.textContent = 'Network error. Please try again.';
  }
});
