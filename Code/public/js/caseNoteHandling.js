/*==========
    By: Michael Goodwyn, Justin Crittenden
    Last Modified: 4/18/2025

    caseNoteHandling.js --> routes buttons in the case note section of clientDetails.ejs
                            to their appropriate locations/functions (new, edit, view, download)
==========*/

// Event Listeners for New, Edit, View, and Download Buttons
// import {jsPDF} from "jspdf";
const newCaseNoteButton = document.getElementById("newCaseNote");
const vieweditCaseNoteButton = document.getElementById("vieweditCaseNote");
const downloadCaseNoteButton = document.getElementById("downloadCaseNote");
const deleteCaseNoteButton = document.getElementById("deleteCaseNote")
const caseNoteRows = document.querySelectorAll(".clickableRow");
const caseNoteTable = document.getElementById("caseNoteTable");
const dialogDelete = document.getElementById("dialogBox");
const yesDelete = document.getElementById("dialogBlack");
const noDelete = document.getElementById("dialogWhite");

// Selectable case note rows
caseNoteRows.forEach(row => {
    row.addEventListener("click", () => {
        // Remove selected class from any rows that have its
        let selectedRows = caseNoteTable.querySelectorAll(".selected");
        for (const selectedRow of selectedRows) {
            if (selectedRow !== row)
                selectedRow.classList.remove("selected");
        }
        // Add selected to the clicked row
        row.classList.toggle("selected");

        // If a row is selected
        if (row.classList.contains("selected"))
        {
            // Enable buttons
            vieweditCaseNoteButton.disabled = false;
            downloadCaseNoteButton.disabled = false;
            deleteCaseNoteButton.disabled = false;
        }
        else
        {
            // Disable buttons
            vieweditCaseNoteButton.disabled = true;
            downloadCaseNoteButton.disabled = true;
            deleteCaseNoteButton.disabled = true;
        }
    })
});

newCaseNoteButton.addEventListener("click", () => {
    const clientID = caseNoteTable.dataset.clientid;
    // let chosenRow = caseNoteTable.querySelector(".selected");
    // let nID = chosenRow.dataset.noteID;
    if (clientID == null) {
        alert("Error: Failed to find case note. Please contact a system administrator");
        return;
    }
    fetch("/caseNote", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({button: "new", noteID: 0, clientID: clientID})
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

});

vieweditCaseNoteButton.addEventListener("click", () => {
    const clientID = caseNoteTable.dataset.clientid;
    let chosenRow = caseNoteTable.querySelector(".selected");
    let noteID = Number(chosenRow.dataset.noteid);
    fetch("/caseNote", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({button: "viewedit", noteID: noteID, clientID: clientID})
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

downloadCaseNoteButton.addEventListener("click", () => {
    let chosenRow = caseNoteTable.querySelector(".selected");
    const clientID = caseNoteTable.dataset.clientid;
    const noteCreator = chosenRow.dataset.notecreator;
    let nID = chosenRow.dataset.noteid;

    const {jsPDF} = window.jspdf;
    const user = document.getElementById("tabContainer").dataset.user;
    const currentDate = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    fetch("/caseNote/download", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({noteID: nID, clientID: clientID})
        })
        .then(response => {
            // Check for errors, if ok then parse JSON
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const doc = new jsPDF(
                {
                    orientation: "portrait",
                    unit: "pt",
                    format: "letter",
                }
            );
            doc.setFont("helvetica");
            /** 306pt */
            const pageMiddle = 306;
            // 8.5in = 612pt, so 612 - 40 -40 = 532pt
            const maxWidth = 532;

            doc.addImage("../icons/logo-color.png", "PNG", 40, 20, 70, 70);

            const xMargin = 40;
            let lastY = 0;
            doc.setFontSize(18);
            lastY += 72;
            doc.text("Case Note", pageMiddle, lastY, {align: "center"});
            doc.setFontSize(14);
            lastY += 18 * 1.15;
            doc.text("Humboldt Community Access and Resource Center", pageMiddle, lastY, {align: "center"});
            doc.setFontSize(11);
            lastY += 14 * 1.15;
            doc.text("Generated by User: " + user, xMargin, lastY);
            lastY += 11 * 1.15;
            doc.text("Generated on: " + currentDate, xMargin, lastY);
            lastY += 11 * 1.6;

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            const disclaimer = doc.splitTextToSize("If you are not the intended recipient of this document or their agent, or if this document " +
                "has been delivered to you in error, please immediately alert HCAR and " +
                "delete this document.", maxWidth);
            doc.text(disclaimer, xMargin, lastY);

            lastY += 11 * 1.15 * (disclaimer.length + 2);

            doc.setFontSize(14);
            const clientName = document.getElementById("clientNameHeader").dataset.clientfullname;
            doc.text("Client: " + clientName, xMargin, lastY);
            lastY += 14 * 2;

            doc.setFontSize(11);
            doc.text("Subject: " + data.subject, xMargin, lastY);
            lastY += 11 * 1.15;

            doc.text("Program: " + data.programName, xMargin, lastY);
            lastY += 11 * 1.15;

            doc.text("Posted By: " + noteCreator, xMargin, lastY);
            lastY += 11 * 1.15;

            doc.autoTable({
                columns: [
                    {header: "Date of Meeting/Activity", dataKey: "dateOfEvent"},
                    {header: "Date of Note Creation", dataKey: "dateCreated"},
                    {header: "Last Modified", dataKey: "dateModified"},
                ],
                body: [
                    data
                ],
                startY: lastY,

            });

            lastY = doc.lastAutoTable.finalY + 20;

            doc.autoTable({
                columns: [
                    {header: "Contact Type", dataKey: "contactType"},
                    {header: "Goal Worked On", dataKey: "goal"}
                ],
                body: [
                    data
                ],
                startY: lastY,
            });

            lastY = doc.lastAutoTable.finalY + 20;

            doc.autoTable({
                columns: [
                    {header: "Narrative", dataKey: "narrative"},
                    {header: "Progress on Goal" , dataKey: "goalProgress"},
                    {header: "Next Steps", dataKey: "nextSteps"}
                ],
                body: [
                    data
                ],
                startY: lastY
            });

            doc.output("pdfobjectnewwindow" , {filename: clientName + "'s Case Note " + user + " " + currentDate + ".pdf"});
        }) 
        .catch(error => console.log("Error: Failed to download case note => ", error))
});


// Show dialog if user clicks delete
deleteCaseNoteButton.addEventListener("click", () => { dialogDelete.showModal(); });

// Event Listener for when user clicks yes to delete
yesDelete.addEventListener("click", () =>
{
    const clientID = Number(caseNoteTable.dataset.clientid);
    let chosenRow = caseNoteTable.querySelector(".selected");
    let noteID = Number(chosenRow.dataset.noteid);
    // Deletion logic
    fetch("/api/deleteCaseNote", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({noteID: noteID, clientID: clientID})
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
            }) 
            .catch(error => console.log("Error: ", error))

    // Take out selected row
    caseNoteTable.querySelector(".selected").remove();
    // Close dialog
    dialogDelete.close();
});

// Close dialog if user clicks no
noDelete.addEventListener("click", () => { dialogDelete.close(); });
