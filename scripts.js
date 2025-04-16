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

            if (cellsFilled < firstDay) {
                // Días del mes anterior
                let prevMonth = (month === 0) ? 11 : month - 1;
                let prevYear = (month === 0) ? year - 1 : year;
                let daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
                let dayNum = daysInPrevMonth - (firstDay - cellsFilled - 1);
            
                let dayNumber = document.createElement("div");
                dayNumber.classList.add("day-number", "other-month");
                dayNumber.textContent = dayNum;
                cell.appendChild(dayNumber);
            
                cell.classList.add("nullDay");
            
            } else if (dayCounter <= numberDays) {
                // Días del mes actual
                let thisDay = dayCounter;
                cell.id = thisDay.toString();
            
                let dayNumber = document.createElement("div");
                dayNumber.classList.add("day-number");
                dayNumber.textContent = thisDay;
                cell.appendChild(dayNumber);
            
                let contentDiv = document.createElement("div");
                contentDiv.classList.add("day-content");
                cell.appendChild(contentDiv);
            
                // Mostrar evento si existe
                let key = `${year}-${month}-${thisDay}`;
                if (events[key]) {
                    let eventData = events[key];
                    let display = eventData.time ? `<strong>${eventData.time}</strong> - ` : "";
                    contentDiv.innerHTML = `${display}<strong>[${eventData.type}]</strong> ${eventData.text}`;
                    cell.classList.add(`event-${eventData.type}`);
                }
            
                cell.addEventListener("click", function () {
                    openEventModal(thisDay);
                });
            
                // Marcar hoy
                if (isTodayMonth && thisDay === today.getDate()) {
                    cell.classList.add("today");
                }
            
                dayCounter++;
            } else {
                // Días del mes siguiente
                let nextDay = (cellsFilled - (firstDay + numberDays)) + 1;
            
                let dayNumber = document.createElement("div");
                dayNumber.classList.add("day-number", "other-month");
                dayNumber.textContent = nextDay;
                cell.appendChild(dayNumber);
            
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
    modalDate.textContent = `${drawnYear}-${drawnMonth + 1}-${day}`;

    let key = `${drawnYear}-${drawnMonth}-${day}`;
    eventText.value = events[key] || "";

    modal.style.display = "block";
    const existingEvent = events[key];

    eventText.value = existingEvent ? existingEvent.text : "";
    document.getElementById("ordue").value = existingEvent && existingEvent.time ? existingEvent.time : "";
    if (existingEvent) {
        document.querySelector(`input[name="eventType"][value="${existingEvent.type}"]`).checked = true;
        if(existingEvent.type == "Biyok"){
            erakutsi_proposatu(false)
            if(!existingEvent.onartua){
                document.getElementById("onartu_retxazau").hidden = false;
            }
        }
    } else {
        document.querySelector('input[name="eventType"][value="Ane"]').checked = true;
        erakutsi_proposatu(false)
    }

    //Gaurko egune jarri
    const mm = String(drawnMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const fechaFormateada = `${drawnYear}-${mm}-${dd}`;
    document.getElementById('hasiera_egune').value = fechaFormateada;

};

closeBtn.onclick = function () {
    modal.style.display = "none";
};

saveBtn.onclick = function () {
    if (selectedDay !== null) {
        //Egun bat baino geyo aukerau ezkeo
        let egune_o_ordue_elegiuta = document.querySelector('input[name="egunek_ordue"]:checked').value
        if(egune_o_ordue_elegiuta == "Egunek"){
            let has_egune = document.getElementById('hasiera_egune').value
            let buk_egune = document.getElementById('bukaera_egune').value
            if(has_egune !== "" && buk_egune !== ""){
                //Tarteko egun danak hartu
                let markatzeko_egunek = []
                const hasierie = new Date(has_egune);
                const bukaerie = new Date(buk_egune);
                orain = hasierie;
                while (orain <= bukaerie) {
                    const yyyy = orain.getFullYear();
                    const mm = String(orain.getMonth());
                    const dd = String(orain.getDate());
                    markatzeko_egunek.push(`${yyyy}-${mm}-${dd}`);
                    
                    // Sumar un día
                    orain.setDate(orain.getDate() + 1);
                }
                //Egun danak markau
                for(var i=0; i < markatzeko_egunek.length; i++){
                    mark_egune = markatzeko_egunek[i];
                    const mark_egune_date = new Date(mark_egune);
                    const dd = mark_egune_date.getDate();
                    let text = eventText.value.trim();
                    const eventType = document.querySelector('input[name="eventType"]:checked').value;
                    let cell = document.getElementById(dd.toString());
                    let content = cell.querySelector(".day-content");

                    if (text) {
                        events[mark_egune] = {
                            text: text,
                            type: eventType,
                            time: ""
                        };

                        // Mostrar
                        content.innerHTML = `<strong>[${eventType}]</strong><br> ${text}`;

                        // Color según tipo
                        cell.classList.remove("event-Aitor", "event-Ane", "event-Biyok");
                        cell.classList.add(`event-${eventType}`);
                    }
                }
            }
        }else{

            let key = `${drawnYear}-${drawnMonth}-${selectedDay}`;
            let text = eventText.value.trim();
            const eventType = document.querySelector('input[name="eventType"]:checked').value;
            const time = document.getElementById("ordue").value;

            let cell = document.getElementById(selectedDay.toString());
            let content = cell.querySelector(".day-content");

            if (text) {
                onartua = true;
                if(eventType == "Biyok"){
                    onartua = false;
                }
                events[key] = {
                    text: text,
                    type: eventType,
                    time: time,
                    onartua: onartua,
                };

                // Mostrar con hora
                let display = time ? `<strong>${time}</strong> - ` : "";
                let onartua_text = onartua ? "Onartua" : "Pendiente";
                content.innerHTML = `<strong>[${display}${eventType} - ${onartua_text}]</strong><br> ${text}`;

                // Color según tipo
                cell.classList.remove("event-Aitor", "event-Ane", "event-Biyok");
                cell.classList.add(`event-${eventType}`);
            } else {
                // Borrar evento
                delete events[key];
                content.textContent = "";
                cell.classList.remove("event-Aitor", "event-Ane", "event-Biyok");
            }
        }
        // Guardar en localStorage (si estás usando)
        localStorage.setItem("calendarEvents", JSON.stringify(events));

        modal.style.display = "none";
    }

    // document.getElementById('jsonTexto').value = JSON.stringify(events, null, 2); // Pruebatako
};

function erakutsi_proposatu(erakutsi){
    if(erakutsi){
        document.getElementById('nork_proposatu_div').hidden = false
    }else
        document.getElementById('nork_proposatu_div').hidden = true
}

function erakutsi_egunak_ordua(zer){
    if(zer == "ordue"){
        document.getElementById('egunek_div').hidden = true
        document.getElementById('ordue_div').hidden = false
    }else{
        document.getElementById('egunek_div').hidden = false
        document.getElementById('ordue_div').hidden = true
    }
}

// document.getElementById('jsonTexto').value = JSON.stringify(events, null, 2);