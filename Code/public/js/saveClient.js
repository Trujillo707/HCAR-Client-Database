const isAdmin = parseInt(document.getElementById("tabContainer").dataset.admin);
const saveButon = document.getElementById("saveButton");

function saveClient(){
    if (isAdmin === 1){
        const maritalStatusOption = document.getElementById("maritalStatus").value;
        /** @type {number} */
        let maritalStatus;
        if (maritalStatusOption === "Single"){
            maritalStatus = 0;
        } else if (maritalStatusOption === "Married"){
            maritalStatus = 1;
        } else if (maritalStatusOption === "Divorced"){
            maritalStatus = 2;
        } else{
            maritalStatus = 3;
        }

        const simpleClientDetails = {
            fName: document.getElementById("firstName").value,
            mName: document.getElementById("middleName").value,
            lName: document.getElementById("lastName").value,
            dateOfBirth: document.getElementById("DoB").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zip: document.getElementById("zip").value,
            phoneNumber: document.getElementById("phoneNumber").value,
            email: document.getElementById("email").value,
            pos: document.getElementById("pos").value,
            gender: document.getElementById("gender").value,
            pronouns: document.getElementById("pronouns").value,
            maritalStatus: maritalStatus,
            preferredHospital: document.getElementById("pref_hospital").value,
            sex: document.getElementById("sex").value,
            likes: document.getElementById("cli_likes").value,
            dislikes: document.getElementById("cli_dislikes").value,
            goals: document.getElementById("cli_goals").value,
            hobbies: document.getElementById("cli_hobs").value,
            achievements: document.getElementById("cli_ach").value,
            miscNotes: document.getElementById("cli_add_notes").value
        };

        const primaryInsurance = {

        }


    } else if (isAdmin === 0) {

    }
}

document.getElementById("saveButton").addEventListener("click", event => {
    saveClient();
});