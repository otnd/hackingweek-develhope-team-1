const fullcalendar = document.querySelector("#fullcalendar")

document.addEventListener('DOMContentLoaded', function () {
    let calendarJS = new FullCalendar.Calendar(fullcalendar, {
        initialView: 'dayGridMonth',
        locale: 'it'
    });
    
    calendarJS.render();
    fullcalendar.setAttribute("class", "hide-container")
});

const calendar = document.querySelector("#calendar")

calendar.addEventListener("click", () => {
    calendar.classList.toggle("active")
    articles.classList.remove("active")
    statistics.classList.remove("active")

    fullcalendar.setAttribute("class", "fc f-media-screen fc-direction-ltr fc-theme-standard")

    sidebarAnimation()
});





