const articlesCount = 'https://api.spaceflightnewsapi.net/v3/articles/count';
// const graficoTorta = document.getElementById("graficoTorta");
// graficoTorta.style.display = 'none';
document.querySelector('#menu-testate').style.display = 'none';


const statistics = document.querySelector('#stats');
const baseUrlGraf = 'https://api.spaceflightnewsapi.net/v3/info';
const menu = document.querySelector('#menu-testate')

async function articlesOrigin() {
    const totArticles = await fetch(articlesCount);
    const totResult = await totArticles.json();

    const responseTestate = await fetch(baseUrlGraf);
    const resultTestate = await responseTestate.json();
    const elencoTestate = resultTestate.newsSites;

    let testate = [];
    for (let i = 0; i < elencoTestate.length; i++) {
        let response = await fetch(`${articlesCount}?newsSite=${i}`);
        testate[i] = await response.json();
    }

    console.log(testate)

    let percentuale = []
    for (let i = 0; i < testate.length; i++) {
        percentuale[i] = (testate[i] * 100) / totResult;
    }

    graficoTorta.parentNode.style.height = "600px"
    graficoTorta.parentNode.style.width = "600px"
    new Chart(graficoTorta, {
        type: 'pie',
        data: {
            labels: [elencoTestate[0], elencoTestate[1], elencoTestate[2], elencoTestate[3], elencoTestate[4], elencoTestate[5], elencoTestate[6], elencoTestate[7], elencoTestate[8], elencoTestate[9], elencoTestate[10], elencoTestate[11], elencoTestate[12], elencoTestate[13], elencoTestate[14], elencoTestate[15], elencoTestate[16], elencoTestate[17], elencoTestate[18], elencoTestate[19], elencoTestate[20], elencoTestate[21], elencoTestate[22], elencoTestate[23], elencoTestate[24], elencoTestate[25], elencoTestate[26], elencoTestate[27], elencoTestate[28], elencoTestate[29], elencoTestate[30], elencoTestate[31]],
            datasets: [{
                label: "Percentuale articoli per testata",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#1a64e4", "#1c415c", "#5a4122", "#447533", "#e3832c", "#bc4f6e", "#a398bb", "#eaeaea"],
                data: [percentuale[0], percentuale[1], percentuale[2], percentuale[3], percentuale[4], percentuale[5], percentuale[6], percentuale[7], percentuale[8], percentuale[9], percentuale[10], percentuale[11], percentuale[12], percentuale[13], percentuale[14], percentuale[15], percentuale[16], percentuale[17], percentuale[18], percentuale[19], percentuale[20], percentuale[21], percentuale[22], percentuale[23], percentuale[24], percentuale[25], percentuale[26], percentuale[27], percentuale[28], percentuale[29], percentuale[30], percentuale[31]]
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Percentuale provenienza articoli'
            },
            mantainAspectRatio: false,
            responsive: true
        }
    });
}

articlesOrigin()






async function monthlyData() {
    let response = await fetch('https://api.spaceflightnewsapi.net/v3/info')
    let data = await response.json();
    let newsSites = data.newsSites;
    console.log(newsSites.length); // 32 testate

    //array mesi
    let month = ['', "Gennaio", 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

    //array vuoto, conterrà tutti gli oggetti
    let stats = [];

    //gira 12 volte, parte da 1 perché il mese 0 non esiste
    for (let i = 1; i < 13; i++) {
        if (i == 1) {
            //per ogni testata, prende i dati di gennaio
            await Promise.all(newsSites.map(async newsSite => {
                let response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles/count?newsSite_contains=${newsSites.indexOf(newsSite)}&publishedAt_gt=2021-12&publishedAt_lt=2022-0${i + 1}`)
                let data = await response.json()
                let obj = { sito: newsSite, mese: month[i], articoli: data }
                stats.push(obj)
            }))
        }
        //per ogni testata, prende i dati da febbraio a dicembre
        else {
            await Promise.all(newsSites.map(async newsSite => {
                let response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles/count?newsSite_contains=${newsSites.indexOf(newsSite)}&publishedAt_gt=2022-0${i - 1}&publishedAt_lt=2022-0${i + 1}`)
                let data = await response.json()
                let obj = { sito: newsSite, mese: month[i], articoli: data }
                stats.push(obj)
            }))
        }
    }

    console.log(stats)
    console.log(stats.length) //384, 32 testate * 12 mesi

    async function creazioneElenco() {
        const response = await fetch(baseUrlGraf);
        const data = await response.json();
        const elenco = data.newsSites;

        elenco.map(item => {
            const option = document.createElement('option');
            option.setAttribute('value', `${elenco.indexOf(item)}`);
            option.className = 'scelta'
            option.textContent = `${item}`;
            menu.append(option)
        })
    }

    creazioneElenco();


    let spaceFlightInsider = stats.filter(element => {
        if (element.sito == 'SpaceFlight Insider') {
            return element.mese + element.articoli
        }
    })

    console.log(spaceFlightInsider)


    let myChart = null;
    menu.addEventListener('change', () => {
        if (myChart != null) {
            myChart.destroy()
        }
        let array = [];
        let text = menu.options[menu.selectedIndex].text;
        console.log(text)
        array = stats.filter(element => {
            if (element.sito == text)
                return element.mese + element.articoli
        })
        console.log(array)
        let datiGrafico = {
            labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            datasets: [{
                label: text,
                data: [array[0]['articoli'], array[1]['articoli'], array[2]['articoli'], array[3]['articoli'], array[4]['articoli'], array[5]['articoli'], array[6]['articoli'], array[7]['articoli'], array[8]['articoli'], array[9]['articoli'], array[10]['articoli'], array[11]['articoli']],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };

        myChart = new Chart(document.querySelector('#graficoBarre'), {
            type: 'bar',
            data: datiGrafico,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

    })
}






monthlyData()
