// Created by: Justin Crittenden
// Last Modified: May 12, 2025
// caseNoteEditing.js - Script for the caseNote.ejs file. 

const backButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");
const confirmDialog = document.getElementById("dialogBox");
const okayButton = document.getElementById("dialogBlack");
const signButton = document.getElementById("sign_button");
const signText = document.getElementById("empl_signoff");

backButton.addEventListener("click", () => history.back());

signButton.addEventListener("click", () =>
{
    let staffName = signButton.dataset.staff;
    signText.value = staffName;
})

// Event Listener for "Create / Save"
saveButton.addEventListener("click", () => {
    const method = saveButton.dataset.method;
    const clientID = Number(saveButton.dataset.clientid);
    const subject = document.getElementById("subject").value;
    const program = document.getElementById("program").value;
    const selectedContact = document.querySelector('input[name="contact_type"]:checked').value;
    const selectedGoal = document.querySelector('input[name="goal_worked_on"]:checked').value;
    const goalProgress = document.getElementById("progress_on_goal").value;
    const narrative = document.getElementById("narrative").value;
    const nextSteps = document.getElementById("next_steps").value;
    const dateOfSignoff = document.getElementById("date_of_signoff").value;
    const dateOfEvent = document.getElementById("date_of_case").value;


    // Validity check
    if (goalProgress == "" || narrative == "" || nextSteps == "" || dateOfEvent == "" || dateOfSignoff == "" || subject == "" || program == "" || signText.value == "")
    {
        alert("Please ensure all required fields are populated");
        return;
    }

    // 'Save' was clicked
    if (method === 'viewedit')
    {
        // Get note id
        const noteID = Number(saveButton.dataset.noteid);
        fetch("/api/updateCaseNote", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({clientID: clientID, contactType: selectedContact, goal: selectedGoal, goalProgress: goalProgress,
                                  narrative: narrative, nextSteps: nextSteps, subject: subject, dateOfSignoff: dateOfSignoff, dateOfEvent: dateOfEvent, program: program, noteID: noteID})
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
                confirmDialog.showModal();
            }) 
            .catch(error => console.log("Error: ", error))
    }
    // 'Create' was clicked
    else if (method === 'new')
    {
        fetch("/api/createCaseNote", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({clientID: clientID, contactType: selectedContact, goal: selectedGoal, goalProgress: goalProgress,
                                  narrative: narrative, nextSteps: nextSteps, subject: subject, dateOfSignoff: dateOfSignoff, dateOfEvent: dateOfEvent, program: program})
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
                confirmDialog.showModal();  
            }) 
            .catch(error => console.log("Error: ", error))

    }
    // Unknown method
    else
    {
        return;
    }
    return;
})

// Event Listener for the 'Okay' button that appears in dialog
okayButton.addEventListener("click", () => { 
    const clientID = saveButton.dataset.clientid;
    confirmDialog.close();
    window.location.href = `/client/${clientID}`;
})