const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Set date Input min with Today's Date
const today = new Date().toISOString().split("T")[0];
//console.log(today);
dateEl.setAttribute("min", today);

//Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        //console.log("distance", distance);

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        //console.log(days, hours, minutes, seconds);

        //Populate Countdown

        //Hide Input
        inputContainer.hidden = true;

        // Show CountDown
        countdownEl.hidden = false;

        //If the contdown has enden,show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            //Else show the coundown in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Take Values Form Imput
function updateCountdown(e) {
    e.preventDefault();
    //console.log(e);
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    console.log(savedCountdown);
    localStorage.setItem("countdown", JSON.stringify(savedCountdown));
    //console.log(countdownTitle, countdownDate);
    //Check for valid date
    if (countdownDate === "") {
        alert("Pleas select a date.");
    } else {
        //Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        // console.log("cDvalue:", countdownValue);
        updateDOM();
    }
}

//Reset all Values
function reset() {
    //HÍide Countdown, show Input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = "";
    countdownDate = "";
    localStorage.removeItem("countdown");
}

function restorePreviousCoundown() {
    //Get coundown from localStorage if availible
    if (localStorage.getItem("countdown")) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem("countdown"));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}
//Event listener
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

//On Load, check localStorage
restorePreviousCoundown();
