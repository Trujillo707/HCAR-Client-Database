const assignClientsButton = document.getElementById('assignClientsButton');
const addEmployeeButton = document.getElementById('addEmployeeButton');
const removeEmployeeButton = document.getElementById('removeEmployeeButton');

assignClientsButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    document.getElementById('assignClients').setAttribute("hidden", "false");

    document.getElementById('addEmployee').setAttribute("hidden", "true");
    // document.getElementById('addEmployee').setAttribute("value", "");

    document.getElementById('removeEmployee').setAttribute("hidden", "true");
    // document.getElementById('removeEmployee').setAttribute("value", "");
})

addEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    document.getElementById('addEmployee').setAttribute("hidden", "false");

    document.getElementById('assignClients').setAttribute("hidden", "true");
    // document.getElementById('addEmployee').setAttribute("value", "");

    document.getElementById('removeEmployee').setAttribute("hidden", "true");
    // document.getElementById('removeEmployee').setAttribute("value", "");
})

removeEmployeeButton.addEventListener('click', () => {
    /* set assignClients div to visible, hide the other divs and clear their data */
    document.getElementById('assignClients').setAttribute("hidden", "false");

    document.getElementById('addEmployee').setAttribute("hidden", "true");
    // document.getElementById('addEmployee').setAttribute("value", "");

    document.getElementById('removeEmployee').setAttribute("hidden", "true");
    // document.getElementById('removeEmployee').setAttribute("value", "");
})