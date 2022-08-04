const calendarSection = document.getElementById('calendar-section')
const calendarBtn = document.getElementById('calendar-btn')
const articlesBtn = document.getElementById('articles-btn')
const graphBtn = document.getElementById('stats-btn')
// inizializzazione oggetto calendario
const calendarEl = document.getElementById('calendar');
const dayClickWindowEl = document.querySelector('#calendar-window')
const textSection = document.querySelector('.test-div')
//questo array contiene gli eventi già inseriti;
const bookedEvents = [];
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    dateClick: async function (info) {
        textSection.innerHTML = 'Loading...';
        let dates = [];


        //giorno corrente
        const day = new Date(info.dateStr);

        //mostra la finestra al click
        dayClickWindowEl.classList.remove('d-none');
        textSection.classList.remove('d-none');

        //conserva la data relativa al giorno precedente 
        day.setDate(day.getDate() - 1)
        dates.push(day.toISOString().substring(0, 10))

        //conserva la data relativa al giorno successivo
        day.setDate(day.getDate() + 2)
        dates.push(day.toISOString().substring(0, 10))
        console.log(dates)

        //il giorno corrente è compreso tra il precedente ed il successivo, possiamo così fetchare i dati relativi attraverso i parametri
        let response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?publishedAt_gt=${dates[0]}T24&publishedAt_lt=${dates[1]}T00&_limit=100`);
        let data = await response.json();
        textSection.innerHTML = '';
        console.log(data)

        if (data.length == 0) {
            const h3 = document.createElement('h3')
            textSection.appendChild(h3)
            h3.innerHTML = `Il ${info.dateStr} non è stato pubblicato nulla`
        }
        else {
            const h3 = document.createElement('h3')
            textSection.appendChild(h3)
            h3.innerHTML = `Pubblicazioni del ${info.dateStr}`

            const ul = document.createElement('ul')
            textSection.appendChild(ul)


            data.forEach(item => {
                const li = document.createElement('li')
                ul.appendChild(li)
                li.innerHTML = `${item.title}`
            })

        }
    }
});

//rimuove la finestra quando si clicca al di fuori di questa;
dayClickWindowEl.addEventListener('click', () => {
    dayClickWindowEl.classList.add('d-none');
    textSection.classList.add('d-none');
})

//renderizza il calendario al click del pulsante calendar-btn, importante che il render non avvenga prima di quest'evento
calendarBtn.addEventListener('click', () => {
    calendarSection.classList.remove('d-none')

    // rendering calendario
    calendar.render();

    const buttonNext = document.querySelector('.fc-next-button');
    const buttonPrevious = document.querySelector('.fc-prev-button');
    const view = calendar.view;

    const todayEndDate = new Date(view.currentEnd.setDate((view.currentEnd.getDate() + 1)))
    const todayDates = getDates(view.currentStart, todayEndDate)
    dynamicPagination(todayDates)


    //event listener sugli elementi del calendario
    buttonNext.addEventListener('click', async () => {
        buttonNext.disabled = true;
        buttonPrevious.disabled = true;
        //prende il primo giorno del mese successivo
        const endDate = new Date(view.currentEnd.setDate((view.currentEnd.getDate() + 1)))

        //genera l'array di date
        const dates = getDates(view.currentStart, endDate)

        //inserisce gli eventi
        await dynamicPagination(dates)
        buttonNext.disabled = false;
        buttonPrevious.disabled = false;
    })

    buttonPrevious.addEventListener('click', async () => {
        buttonNext.disabled = true;
        buttonPrevious.disabled = true;
        const endDate = new Date(view.currentEnd.setDate((view.currentEnd.getDate() + 1)));
        const dates = getDates(view.currentStart, endDate);
        await dynamicPagination(dates);
        buttonNext.disabled = false;
        buttonPrevious.disabled = false;

    })
})

articlesBtn.addEventListener('click', () => {
    calendarSection.classList.add('d-none')

})

graphBtn.addEventListener('click', () => {
    calendarSection.classList.add('d-none')
})




//date due date, genera un array di tutte quelle comprese tra queste, convertite in formato ISO,
//quello che utilizza la proprietà publishedAt;
function getDates(start, end) {
    const date = new Date(start.getTime());
    const dates = [];
    while (date <= end) {
        dates.push(date.toISOString().substring(0, 10))
        date.setDate(date.getDate() + 1);
    }
    return dates;
}



//gestisce dinamicamente l'impaginazione del calendario;
async function dynamicPagination(dates) {
    let eventsArr = [];

    //utilizziamo promise.all ed il metodo map sull'array di date generato da getDates(),
    //in questa maniera le request avvengono in parallelo, minimizzando i caricamenti;
    await Promise.all(dates.map(async (element, index) => {
        if (index == 0 || index - dates.length == -1) {
            console.log('primo elemento')
        }

        else {
            //un giorno qualsiasi del calendario è compreso tra due, il precedente ed il successivo,
            //sapendo ciò possiamo quindi ricavare un giorno in particolare utilizzando i parametri _gt & _lt
            const fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${dates[index - 1]}T24&publishedAt_lt=${dates[index + 1]}T00`
            const response = await fetch(fetchUrl);
            const data = await response.json();

            const dataStr = await data.toString();
            const eventObj = {
                title: `${dataStr} pubblicazioni`,
                start: `${element}`,
                end: `${dates[index + 1]}`,
            };

            //verifica che l'evento non sia stato già stato inserito nel calendario
            if (bookedEvents.some(item => item.start === eventObj.start)) { }
            else { eventsArr.push(eventObj); bookedEvents.push(eventObj) }
        }
    }))

    eventsArr.forEach(event =>
        calendar.addEvent(
            {
                title: event.title,
                start: event.start,
                end: event.end,
            }
        ))
}







