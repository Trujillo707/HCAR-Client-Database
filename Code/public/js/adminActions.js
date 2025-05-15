/*===
    File: adminActions.js
    By: Michael Goodwyn
    Last Modified:

    Description: This file handles all of the actions from
    the admin.ejs page.
===*/

// Search button declarations inside admin actions
const assignClientSearchButton = document.getElementById('assignClientSearchButton');
const removeEmplSearchButton = document.getElementById('removeEmplSearchButton');
const removeClientSearchButton = document.getElementById('removeClientSearchButton');

const assignClientResult = document.getElementById('assignClientResult');

// Submit button declarations for admin functions
const addEmployeeSubmitButton = document.getElementById('addEmployeeSubmit');
const removeEmployeeSubmitButton = document.getElementById('removeEmployeeSubmit');
const addClientSubmitButton = document.getElementById('addClientSubmit');
const removeClientSubmitButton = document.getElementById('removeClientSubmit');

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
                alert(data.message);



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
                option.value = employee.staffID;
                option.textContent = employee.fName + " " + employee.mName + " " + employee.lName;
                removeEmplSearchSelect.appendChild(option);
            });

            // Check if the search returned no results, invis if so
            if (removeEmplSearchSelect.options.length === 1) {
                removeEmplSearchSelect.style.display = "none";
            }
            else {
                removeEmplSearchSelect.style.display = "block";
            }

            // status message for the user:
            if (data.Error) {
                alert(data.Error);
            }
            else {
                alert(data.message);
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
                // Consider outputting message to screen
                console.log(data.message);
                console.log("error: " + data.Error);
                alert("Successfully deleted employee");
                // document.getElementById("removeEmplSearchSelect").option.remove();
                console.log(document.getElementById("removeEmplSearchSelect").value);
            })
            .catch(error => console.log("Error: ", error))
        // window.location.reload();
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
                    alert(data.message);
                }
                console.log(data.message);
                console.log("error: " + data.Error);
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
                option.textContent = client.clientID + ": " + client.fName +  " " client.mName + " " + client.lName;
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
                    alert(data.message);
                }
            })
            .catch(error => console.log("Error: ", error))
    }
})