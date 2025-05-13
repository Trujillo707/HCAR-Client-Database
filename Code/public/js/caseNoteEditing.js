// Created by: Justin Crittenden
// Last Modified: May 12, 2025
// caseNoteEditing.js - Script for the caseNote.ejs file. 

const backButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

backButton.addEventListener("click", () => history.back());

// Event Listener for "Save"
saveButton.addEventListener("click", () => {
    const method = saveButton.dataset.method;
    // const clientID = Number(saveButton.dataset.clientid);
    // const subject = document.getElementById("subject").value;
    // const program = document.getElementById("program").value;
    // const selectedContact = document.querySelector('input[name="contact_type"]:checked').value.trim();
    // const selectedGoal = document.querySelector('input[name="goal_worked_on"]:checked').value.trim();
    // const goalProgress = document.getElementById("progress_on_goal").value;
    // const narrative = document.getElementById("narrative").value;
    // const nextSteps = document.getElementById("next_steps").value;
    // const dateOfSignoff = document.getElementById("date_of_signoff").value;
    // const dateOfEvent = document.getElementById("date_of_case").value;


    // Validity check
    // if (goalProgress == "" || narrative == "" || nextSteps == "" || dateOfEvent == "" || dateOfSignoff == "" || subject == "" || program == "")
    // {
    //     alert("Please ensure all required fields are populated");
    //     return;
    // }

    // 'Save' was clicked
    if (method === 'viewedit')
    {
        // Get note id
        // const noteID = Number(saveButton.dataset.noteid);
        alert("Saved!");
    }
    // 'Create' was clicked
    else if (method === 'new')
    {
        // console.log(`Contact type: '${selectedContact}'`);
        // console.log(`Goal type: '${selectedGoal}'`);
        // if (selectedContact.match(/' '/) || selectedGoal.match(/' '/))
        //     console.log("contains whitespace");

        // fetch("/api/createCaseNote", {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({clientID: clientID, contactType: selectedContact, goal: selectedGoal, goalProgress: goalProgress,
        //                           narrative: narrative, nextSteps: nextSteps, subject: subject, dateOfSignoff: dateOfSignoff, dateOfEvent: dateOfEvent, program: program})
        //     })
        //     .then(response => {
        //         // Check for errors, if ok then parse JSON
        //         if (!response.ok)
        //             throw new Error(`Error: ${response.status}`);
        //         return response.json();
        //     })
        //     .then(data => {
        //         // if (data.redirect)
        //         //     window.location.href = data.redirect;
        //         console.log(data);
        //     }) 
        //     .catch(error => console.log("Error: ", error))
        alert("Case note created!");

    }
    // Unknown method
    else
    {
        return;
    }
    return;
})