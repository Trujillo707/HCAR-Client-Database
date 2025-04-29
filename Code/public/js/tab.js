// Adapted from W3Schools
// Edited by Orlando Trujillo-Ortiz

/* Apparently its bad practice to send events directly, instead its more modern to
   set up eventListeners
 */
let list = document.querySelectorAll('.tablinks');

list.forEach( currButton => {
        currButton.addEventListener('click', function () {
            const theName = this.getAttribute('data-tabName');
            openTab(theName);
        })
    }
);

function openTab(tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.querySelectorAll(".tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.querySelectorAll(".tablinks");
    tablinks.forEach(currLink => {
        if (currLink.getAttribute('data-tabName') === tabName){
            currLink.classList.add('active');
        }
        else{
            currLink.classList.remove('active');
        }
    });
    document.getElementById(tabName).style.display = "grid";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();