// inizializzazione oggetto calendario
const calendarEl = document.getElementById('calendar');
const dayClickWindowEl = document.querySelector('#calendar-window')
const textSection = document.querySelector('.test-div')
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    dateClick: async function (info) {
        textSection.innerHTML = 'Loading...';
        let dates = [];


        //giorno corrente
        const day = new Date(info.dateStr);

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

dayClickWindowEl.addEventListener('click', () => {
    dayClickWindowEl.classList.add('d-none');
    textSection.classList.add('d-none');
})


// rendering calendario
calendar.render();

const buttonNext = document.querySelector('.fc-next-button');
const buttonPrevious = document.querySelector('.fc-prev-button');
const view = calendar.view;

//questo array contiene gli eventi già inseriti;
let bookedEvents = [];

//funzione che permette di ricavare ogni dato relativo alle pubblicazioni dinamicamente,
//dal primo giorno che l'api ha cominciato a collezionare dati fino ad oggi,
//le chiamate vengono gestite in parallelo
async function dynamicPagination(currentMonth, currentYear) {
    const thirtyDaysMonth = [4, 6, 9, 11];
    //utilizziamo un array invece di un normale ciclo per utilizzare il metodo map, 
    //in maniera tale da poter usare Promise.all;
    const numOfMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    let eventsArr = [];
    buttonNext.disabled = true;
    buttonPrevious.disabled = true;

    //utilizzando Promise.all ci viene fornita la possibilità di effettuare le richieste necessarie in parallelo,
    //incrementando moltissimo le performance;
    await Promise.all(numOfMonths.map(async i => {
        //condizione per mesi da 30 giorni, il ciclo deve quindi avere un'iterazione in meno
        if (thirtyDaysMonth.indexOf(currentMonth) != -1) {
            if (i == 31) {
                return
            }
        }

        //condizione per febbraio
        if (currentMonth == 2) {
            if (i == 29) {
                return
            }
        }

        //per ricavare il giorno attuale tramite i parametri _gt e _lt, è necessario individuare i due giorni nei quale esso è compreso;
        let day = '0' + i.toString(); // giorno attuale
        let previousDay = `0${i - 1}`;// giorno precedente
        let nextDay = `0${i + 1}`; // giorno successivo
        let month = '0' + currentMonth.toString(); //mese attuale

        //è necessario che le variabili assumano, in determinate iterazioni, valori differenti per utilizzare correttamente e dinamicamente i parametri;
        //es. il parametro ?publishedAt_gt=2022-1-1 non funzionerebbe, è necessario indicare la data con questo formato: 2022-01-01;
        if (i > 9 && i != 10) {
            //es. i = 11;
            day = i; //19
            previousDay = `${i - 1}`; // 10;
            nextDay = `${i + 1}`; // 12;
        }
        if (i == 10) {
            day = i; // 10
            previousDay = `0${i - 1}`; // 09
            nextDay = `${i + 1}`; //11
        }

        if (i == 9) {
            day = '0' + i.toString(); // 09
            previousDay = `0${i - 1}`;//08
            nextDay = `${i + 1}`;//10
        }

        if (month > 9) {
            //es. 11 (Novembre)
            month = currentMonth; // 11
        }

        let fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${month}-${nextDay}T00`;

        //i giorni 1, 31,30 (per i mesi da 30 giorni), 28(per febbraio) hanno bisogno di parametri diversi;
        //Differiscono dagli altri perché uno dei due giorni nei quali sono compresi appartiene ad un altro mese;
        if (i == 1 && currentMonth != 1) {
            if (currentMonth >= 11) { fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${currentMonth - 1}-${30}T24&publishedAt_lt=${currentYear}-${month}-${nextDay}T00` };
            if (currentMonth <= 10) {
                //es. 9
                let previousMonth = `0${currentMonth - 1}`; //08
                fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${previousMonth}-${30}T24&publishedAt_lt=${currentYear}-${month}-${nextDay}T00`;
            }
        }

        if (i == 31) {
            if (currentMonth >= 10) { fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${currentMonth + 1}-0${1}T00` };
            if (currentMonth <= 8) {
                //es. 7
                let nextMonth = `0${currentMonth + 1}`; //08
                fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${nextMonth}-0${1}T00`;
            }
        }

        if (i == 30 && thirtyDaysMonth.indexOf(currentMonth) != -1) {
            if (currentMonth >= 10) { fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${currentMonth + 1}-0${1}T00` };
            if (currentMonth <= 8) {
                let nextMonth = `0${currentMonth + 1}`;
                fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${nextMonth}-0${1}T00`;
            }
            if (currentMonth == 9) {
                let nextMonth = currentMonth + 1;
                fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${month}-${previousDay}T24&publishedAt_lt=${currentYear}-${nextMonth}-0${1}T00`;
            }
        }

        if (i == 28 && currentMonth == 2) {
            fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-02-27T24&publishedAt_lt=${currentYear}-03-01T00`;
        }
        if (i == 1 && currentMonth == 3) {
            let previousMonth = `0${currentMonth - 1}`; 
            fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-${previousMonth}-${28}T24&publishedAt_lt=${currentYear}-${month}-${nextDay}T00`;
        }

        //il 1 gennaio e il 31 dicembre sono compresi tra due anni e due mesi diversi
        if (i == 1 && currentMonth == 1) {
            let previousYear = currentYear - 1;
            fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${previousYear}-12-31T24&publishedAt_lt=${currentYear}-01-02T00`;
        }
        if (i == 31 && currentMonth == 12) {
            let nextYear = currentYear + 1;
            fetchUrl = `https://api.spaceflightnewsapi.net/v3/articles/count?publishedAt_gt=${currentYear}-12-30T24&publishedAt_lt=${nextYear}-01-01T00`;
        }

        //terminate le verifiche necessarie, fetchiamo i dati ed inseriamoli nel calendario;
        let response = await fetch(fetchUrl);
        console.log(fetchUrl);
        let data = await response.json();
        let dataStr = await data.toString();
        let eventObj = {
            title: `Pubblicazioni: ${dataStr}`,
            start: `${currentYear}-${month}-${day}`,
            end: `${currentYear}-${month}-${day}`,
        };
        //verifica che l'evento non sia stato già stato inserito nel calendario
        if (bookedEvents.some(item => item.start === eventObj.start)) { }
        else { eventsArr.push(eventObj); bookedEvents.push(eventObj) }

    }))

    eventsArr.forEach(event =>
        calendar.addEvent(
            {
                title: event.title,
                start: event.start,
                end: event.end,
            }
        ))

    buttonNext.disabled = false;
    buttonPrevious.disabled = false;
}

async function dynamicPagination_v2(start, end){
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() + 1);
    let dateArr = [];
    for(i = start; i < end; i++){
        dateArr.push(i)
    }
    console.log(dateArr)
}


//sostituire con una funzione che recuperi la data odierna
dynamicPagination(8, 2022)

buttonNext.addEventListener('click', () => {
    currentMonth = Number(view.currentStart.getMonth()) + 1;
    currentYear = view.currentStart.getFullYear();
    dynamicPagination(currentMonth, currentYear);
})

buttonPrevious.addEventListener('click', () => {
    currentMonth = Number(view.currentStart.getMonth()) + 1;
    currentYear = view.currentStart.getFullYear();
    dynamicPagination(currentMonth, currentYear);
})






