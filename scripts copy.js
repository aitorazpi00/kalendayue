//Holds currently drawn Month and Year values, currentToken, and user selected Event Type filters
let drawnMonth;
let drawnYear;
let eventTypes = [];
let currentToken;

//Clears main calendar elements to be redrawn
const clearCal = function() {
    document.getElementById("month_and_year").innerHTML = "";
    document.getElementById("tbody").innerHTML = "";
}
//Calls drawCalendar using current drawnMonth and drawnYear
const currentCal = function() {
    drawCalendar(drawnYear, drawnMonth);
}
//Finds today's date information and calls the drawCalendar function
const todayCal = function() {
    let today = new Date();
    let curYear = today.getFullYear();
    let curMonth = today.getMonth();
    drawCalendar(curYear, curMonth);
}
//Identifies previous month/year and calls drawCalendar
const previous = function() {
    if (drawnMonth == 0) {
        let prevMonth = 11;
        let prevYear = drawnYear - 1;
        drawCalendar(prevYear, prevMonth);
    }
    
    else {
        let prevMonth = drawnMonth - 1;
        let prevYear = drawnYear;
        drawCalendar(prevYear, prevMonth);
    }
}
//Identifies next month/year and calls draw calendar
const next = function() {
    if (drawnMonth == 11) {
        let prevMonth = 0;
        let prevYear = drawnYear + 1;
        drawCalendar(prevYear, prevMonth);
    }
    else {
        let prevMonth = drawnMonth + 1;
        let prevYear = drawnYear;
        drawCalendar(prevYear, prevMonth);
    }
}
//months
let months = ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
//draws calendar, populates Month and Year Label and days of the month
const drawCalendar = function(year, month) {
    drawnMonth = month; //sets currently drawn variables
    drawnYear = year;

    clearCal(); //clear calendar drawing

    let ymTag = document.createElement("h2"); //create Month Year tag
    ymTag.appendChild(document.createTextNode(months[month]+" "+year));
    ymTag.id = "myChild";
    document.getElementById("month_and_year").appendChild(ymTag);

    let theMY = new Date(year, month); //draw Calendar
    let firstDay = theMY.getDay();
    let numberDays = new Date(year, month+1, 0).getDate();
    let dayCounter = 0;
    for (let i = 0; i < 5; i++) {
        let r = document.createElement("tr");
        for (let y = 0; y < 7; y++) {
            let d = document.createElement("td");
            if (dayCounter < firstDay) {
                d.id = "nullDay";
                d.innerHTML = "   ";
                r.appendChild(d);
            }
            if (dayCounter >= firstDay && dayCounter < (numberDays + firstDay)) { //within valid dates, so draw calendar dates
                d.id = (dayCounter - (firstDay - 1)).toString();
                let date = document.createElement("p");
                date.appendChild(document.createTextNode((dayCounter - (firstDay - 1)).toString()));
                d.appendChild(date);
                maxDate = dayCounter - (firstDay - 1); //set max possible date for this month
            }
            else {
                d.id = "nullDay";
                d.innerHTML = "   ";
                r.appendChild(d);
            }
            dayCounter++;
        }
        r.classList.add("tableChildren");
        document.getElementById("tbody").appendChild(r);
    }
}

// General Event Listeners:
// Populate calendar with today's date when page is loaded
document.addEventListener("DOMContentLoaded", todayCal, false);
// Populate calendar with today's date when calednar title is pressed
document.getElementById("title").addEventListener("click", todayCal, false);
// Repopulate calendar when next and previous buttons are pressed
document.getElementById("previous").addEventListener("click", previous, false);
document.getElementById("next").addEventListener("click", next, false);

todayCal()