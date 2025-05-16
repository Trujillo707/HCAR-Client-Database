/*===
    File: adminActions.js
    By: Michael Goodwyn
    Last Modified:

    Description: This file handles all of the actions from
    the admin.ejs page.
===*/

// Search button declarations inside admin actions
const removeEmplSearchButton = document.getElementById('removeEmplSearchButton');
const removeClientSearchButton = document.getElementById('removeClientSearchButton');
const assignClientSearchClientButton = document.getElementById('assignClientSearchClientButton');
const assignClientSearchEmployeeButton = document.getElementById('assignClientSearchEmployeeButton');

const assignClientResult = document.getElementById('assignClientResult');

// Submit button declarations for admin functions
const addEmployeeSubmitButton = document.getElementById('addEmployeeSubmit');
const removeEmployeeSubmitButton = document.getElementById('removeEmployeeSubmit');
const addClientSubmitButton = document.getElementById('addClientSubmit');
const removeClientSubmitButton = document.getElementById('removeClientSubmit');
const assignClientSubmitButton = document.getElementById('assignClientSubmit');

assignClientSearchClientButton.addEventListener('click', () => {
    let assignClientClient = document.getElementById('assignClientClient');
    // Fetch the searchClient API to delete the employee if true, else do nothing
    fetch("/admin/searchClients", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: document.getElementById('assignClientFirstName').value,
            lastName: document.getElementById('assignClientLastName').value
        })
    })
        .then(response => {
            // Check for errors, if ok then parse JSON
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            while (assignClientClient.options.length > 1) {
                assignClientClient.remove(1);
            }

            // populating the results:
            data.forEach((client) => {
                const option = document.createElement("option");
                option.value = client.clientID;
                option.textContent = client.clientID + ": " + client.fName +  " " + client.lName;
                assignClientClient.appendChild(option);
            });

            // status message for the user:
            if (data.Error) {
                alert(data.Error);
            }
            else {
                alert("Search Successful");
            }
        })
        .catch(error => console.log("Error: ", error))
});
assignClientSearchEmployeeButton.addEventListener('click', () => {
    let assignClientEmplSelect = document.getElementById('assignClientEmpl');
    fetch("/api/searchStaff", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fName: document.getElementById('assignEmployeeFirstName').value,
            lName: document.getElementById('assignEmployeeLastName').value,
        })
    })
        .then(response => {
            // Check for errors, if ok then parse JSON
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            while (assignClientEmplSelect.options.length > 1) {
                assignClientEmplSelect.remove(1);
            }

            // populating the results:
            data.forEach((employee) => {
                const option = document.createElement("option");
                option.value = employee.accountID;
                option.textContent = employee.fName + " " + employee.mName + " " + employee.lName;
                assignClientEmplSelect.appendChild(option);
            });

            // status message for the user:
            if (data.Error) {
                alert(data.Error);
            }
            else {
                alert("Search Successful");
            }
        })
        .catch(error => console.log("Error: ", error))
});

addEmployeeSubmitButton.addEventListener('click', () => {
    let decision = confirm("Are you sure you want to add an employee using this information?");
    if(decision){
        fetch("/api/createAccount", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fName: document.getElementById('addEmployeeFName').value,
                mName: document.getElementById('addEmployeeMName').value,
                lName: document.getElementById('addEmployeeLName').value,
                username: document.getElementById('addEmployeeUser').value,
                password: document.getElementById('addEmployeePass').value,
                address: document.getElementById('addEmployeeAddress').value,
                city: document.getElementById('addEmployeeCity').value,
                state: document.getElementById('addEmployeeState').value,
                zip: document.getElementById('addEmployeeZip').value,
                phoneNumber: document.getElementById('addEmployeePhone').value,
                admin: document.getElementById('addEmployeeAdminCheckbox').checked
            })
        })
            .then(response => {
                // Check for errors, if ok then parse JSON
                if (!response.ok)
                    throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Clearing all inputs:
                const inputs = document.querySelectorAll('#addEmployee input');
                inputs.forEach((input) => {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    }
                    else {
                        input.value = '';
                    }
                })
                if(data.Error) {
                    alert("Error: " + data.Error);
                }
                else {
                    window.location.href = "/admin?alertMessage=Added+Employee+Successfully";
                }
            })
            .catch(error => console.log("Error: ", error))
    }
});


removeEmplSearchButton.addEventListener('click', () => {
    let removeEmplSearchSelect = document.getElementById('removeEmplSearchSelect');

    fetch("/api/searchStaff", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fName: document.getElementById('removeEmplFName').value,
            lName: document.getElementById('removeEmplLName').value,
        })
    })
        .then(response => {
            // Check for errors, if ok then parse JSON
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            while (removeEmplSearchSelect.options.length > 1) {
                removeEmplSearchSelect.remove(1);
            }

            // populating the results:
            data.forEach((employee) => {
                const option = document.createElement("option");
                option.value = employee.accountID;
                option.textContent = employee.fName + " " + employee.mName + " " + employee.lName;
                removeEmplSearchSelect.appendChild(option);
            });

            // status message for the user:
            if (data.Error) {
                alert(data.Error);
            }
            else {
                alert("Search Successful");
            }
        })
        .catch(error => console.log("Error: ", error))
});
removeEmployeeSubmitButton.addEventListener('click', () => {
    let decision = confirm("Are you sure you want to delete this employee? This action cannot be undone.");
    // Fetch the deleteAccount API to delete the employee if true, else do nothing
    if (decision) {
        // console.log(document.getElementById('removeEmplSearchSelect').value);
        fetch("/api/deleteAccount", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Pass in the staff ID from the employee search select
            body: JSON.stringify({
                accountID: document.getElementById('removeEmplSearchSelect').value,
            })
        })
            .then(response => {
                // Check for errors, if ok then parse JSON
                if (!response.ok)
                    throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if(data.Error) {
                    console.log("error: " + data.Error);
                }
                else {
                    window.location.href = "/admin?alertMessage=Removed+Employee+Successfully";
                }
            })
            .catch(error => console.log("Error: ", error))
    }
});


addClientSubmitButton.addEventListener('click', () => {
    let decision = confirm("Are you sure you want to add a client using this information?");
    if(decision){
        fetch("/api/createClient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fName: document.getElementById('addClientFName').value,
                mName: document.getElementById('addClientMName').value,
                lName: document.getElementById('addClientLName').value,
                address: document.getElementById('addClientAddress').value,
                addressType: "%",
                city: document.getElementById('addClientCity').value,
                state: "%",
                zip: document.getElementById('addClientZip').value,
                dateOfBirth: document.getElementById('addClientDoB').value,
                phoneNumber: document.getElementById('addClientPhone').value,
                phoneType: "%",
                sex: "%",
                gender: "%",
                pronouns: "%",
                greeting: "%",
                nickname: "%",
                maritalStatus: "%",
                religPref: "%",
                payee: "%",
                preferredHospital: "%",
                conservator: "%"
            })
        })
            .then(response => {
                // Check for errors, if ok then parse JSON
                if (!response.ok)
                    throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Consider outputting message to screen
                if(data.Error) {
                    alert("Error: " + data.Error);
                }
                else {
                    window.location.href = "/admin?alertMessage=Added+Client+Successfully";
                }
            })
            .catch(error => console.log("Error: ", error))
    }
})


removeClientSearchButton.addEventListener('click', () => {
    let removeClientSelect = document.getElementById('removeClientSelect');

    // Fetch the deleteAccount API to delete the employee if true, else do nothing
    fetch("/admin/searchClients", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: document.getElementById('removeClientFName').value,
            lastName: document.getElementById('removeClientLName').value
        })
    })
        .then(response => {
            // Check for errors, if ok then parse JSON
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(document.getElementById('removeClientFName').value);
            while (removeClientSelect.options.length > 1) {
                removeClientSelect.remove(1);
            }

            // populating the results:
            data.forEach((client) => {
                const option = document.createElement("option");
                option.value = client.clientID;
                option.textContent = client.clientID + ": " + client.fName +  " " + client.lName;
                removeClientSelect.appendChild(option);
            });

            // status message for the user:
            if (data.Error) {
                alert(data.Error);
            }
            else {
                alert("Search Successful");
            }
        })
        .catch(error => console.log("Error: ", error))
})
removeClientSubmitButton.addEventListener('click', () => {
    let decision = confirm("Are you sure you want to delete this client? This action cannot be undone.");
    let removeClientSelect = document.getElementById('removeClientSelect');
    // Fetch the deleteAccount API to delete the employee if true, else do nothing
    if (decision) {
        // console.log(document.getElementById('removeEmplSearchSelect').value);
        fetch("/api/deleteClient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientID: document.getElementById('removeClientSelect').value
            })
        })
            .then(response => {
                // Check for errors, if ok then parse JSON
                if (!response.ok)
                    throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // status message for the user:
                if (data.Error) {
                    alert(data.Error);
                }
                else {
                    window.location.href = "/admin?alertMessage=Removed+Client+Successfully";
                }
            })
            .catch(error => console.log("Error: ", error))
    }
})