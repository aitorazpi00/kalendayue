let drawnMonth;
let drawnYear;
let eventTypes = [];
let currentToken;

const clearCal = function () {
    document.getElementById("month_and_year").innerHTML = "";
    document.getElementById("tbody").innerHTML = "";
};

const currentCal = function () {
    drawCalendar(drawnYear, drawnMonth);
};

const todayCal = function () {
    let today = new Date();
    let curYear = today.getFullYear();
    let curMonth = today.getMonth();
    drawCalendar(curYear, curMonth);
};

const previous = function () {
    let prevMonth = (drawnMonth === 0) ? 11 : drawnMonth - 1;
    let prevYear = (drawnMonth === 0) ? drawnYear - 1 : drawnYear;
    drawCalendar(prevYear, prevMonth);
};

const next = function () {
    let nextMonth = (drawnMonth === 11) ? 0 : drawnMonth + 1;
    let nextYear = (drawnMonth === 11) ? drawnYear + 1 : drawnYear;
    drawCalendar(nextYear, nextMonth);
};

let months = [
    "Urtarrila", "Otsaila", "Martxoa", "Apirila",
    "Maiatza", "Ekaina", "Uztaila", "Abuztua",
    "Iraila", "Urria", "Azaroa", "Abendua"
];

const drawCalendar = function (year, month) {
    drawnMonth = month;
    drawnYear = year;

    clearCal();

    // Título con mes y año
    let ymTag = document.createElement("h2");
    ymTag.appendChild(document.createTextNode(months[month] + " " + year));
    ymTag.id = "myChild";
    document.getElementById("month_and_year").appendChild(ymTag);

    let firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Ajustar para que empiece lunes

    let numberDays = new Date(year, month + 1, 0).getDate();
    let totalCells = firstDay + numberDays;
    let numRows = Math.ceil(totalCells / 7);

    let today = new Date();
    let isTodayMonth = (today.getFullYear() === year && today.getMonth() === month);

    let dayCounter = 1;
    let cellsFilled = 0;

    for (let i = 0; i < numRows; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if (cellsFilled >= firstDay && dayCounter <= numberDays) {
                cell.id = dayCounter.toString();

                // Número del día en la esquina
                let dayNumber = document.createElement("div");
                dayNumber.classList.add("day-number");
                dayNumber.textContent = dayCounter.toString();
                cell.appendChild(dayNumber);

                // Espacio para eventos u otro contenido
                let contentDiv = document.createElement("div");
                contentDiv.classList.add("day-content");
                let thisDay = dayCounter;
                cell.addEventListener("click", function () {
                    openEventModal(thisDay);
                });
             
                cell.appendChild(contentDiv);

                // Resaltar hoy
                if (isTodayMonth && dayCounter === today.getDate()) {
                    cell.classList.add("today");
                }

                dayCounter++;
            } else {
                cell.classList.add("nullDay");
            }

            row.appendChild(cell);
            cellsFilled++;
        }

        document.getElementById("tbody").appendChild(row);
    }
};

// Listeners para navegación
document.addEventListener("DOMContentLoaded", todayCal, false);
document.getElementById("title").addEventListener("click", todayCal, false);
document.getElementById("previous").addEventListener("click", previous, false);
document.getElementById("next").addEventListener("click", next, false);

const modal = document.getElementById("eventModal");
const closeBtn = document.querySelector(".close");
const modalDate = document.getElementById("modalDate");
const eventText = document.getElementById("eventText");
const saveBtn = document.getElementById("saveEvent");

let selectedDay = null;
let events = {}; // Guardamos eventos en memoria

const openEventModal = function(day) {
    selectedDay = day;
    modalDate.textContent = `${day}/${drawnMonth + 1}/${drawnYear}`;

    let key = `${drawnYear}-${drawnMonth}-${day}`;
    eventText.value = events[key] || "";

    modal.style.display = "block";
};

closeBtn.onclick = function () {
    modal.style.display = "none";
};

// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// };

saveBtn.onclick = function () {
    if (selectedDay !== null) {
        let key = `${drawnYear}-${drawnMonth}-${selectedDay}`;
        let text = eventText.value.trim();

        let cell = document.getElementById(selectedDay.toString());
        let content = cell.querySelector(".day-content");

        if (text) {
            // Guardar o actualizar
            events[key] = text;
            content.textContent = text;
        } else {
            // Eliminar si existe
            delete events[key];
            content.textContent = "";
        }

        modal.style.display = "none";
    }
};
