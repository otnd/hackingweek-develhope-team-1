const articlesCount = 'https://api.spaceflightnewsapi.net/v3/articles/count';
const graficoTorta = document.getElementById("graficoTorta");
graficoTorta.style.display = 'none';
document.querySelector('#spaceFlightInsiderChart').style.display = 'none';
document.querySelector('#nasaSpaceflightChart').style.display = 'none';
document.querySelector('#spaceXchart').style.display = 'none';
document.querySelector('#elonXchart').style.display = 'none';
document.querySelector('#blueOriginChart').style.display = 'none';
document.querySelector('#spaceflightNowChart').style.display = 'none';
document.querySelector('#spaceComChart').style.display = 'none';
document.querySelector('#teslaratiChart').style.display = 'none';
document.querySelector('#virginGalaticChart').style.display = 'none';
document.querySelector('#physChart').style.display = 'none';
document.querySelector('#theJapanTimesChart').style.display = 'none';
document.querySelector('#nationalGeographicChart').style.display = 'none';
document.querySelector('#spaceNewsChart').style.display = 'none';
document.querySelector('#theNationalChart').style.display = 'none';
document.querySelector('#nasaChart').style.display = 'none';
document.querySelector('#theSpaceReviewChart').style.display = 'none';
document.querySelector('#theVergeChart').style.display = 'none';
document.querySelector('#theDriveChart').style.display = 'none';
document.querySelector('#arstechnicaChart').style.display = 'none';
document.querySelector('#esaChart').style.display = 'none';
document.querySelector('#theSpaceDevsChart').style.display = 'none';
document.querySelector('#americaSpaceChart').style.display = 'none';
document.querySelector('#theWallStreetJournalChart').style.display = 'none';
document.querySelector('#cnbcChart').style.display = 'none';
document.querySelector('#reutersChart').style.display = 'none';
document.querySelector('#euronewsChart').style.display = 'none';

const statistics = document.querySelector('#stats');

async function articlesOrigin() {
    const totArticles = await fetch(articlesCount);
    const totResult = await totArticles.json();

    let testate = [];
    for (let i = 1; i < 33; i++) {
        let response = await fetch(`${articlesCount}?newsSite=${i}`);
        testate[i] = await response.json();
    }

    let percentuale = []
    for (let i = 0; i < testate.length; i++) {
        percentuale[i] = (testate[i] * 100) / totResult;
    }

    graficoTorta.parentNode.style.height = "600px"
    graficoTorta.parentNode.style.width = "600px"
    new Chart(graficoTorta, {
        type: 'pie',
        data: {
            labels: ["SpaceFlight Insider", "Nasa Spaceflight", "SpaceX", "ElonX", "Blue Origin", "Spaceflight Now", "Space.com", "Teslarati", "Virgin Galatic", "Phys", "The Japan Times", "National Geographic", "SpaceNews", "The National", "NASA", "The Space Review", "The Verge", "The Drive", "Arstechnica", "ESA", "The Space Devs", "AmericanSpace", "The Wall Street Journal", "CNBC", "Reuters", "euronews"],
            datasets: [{
                label: "Percentuale articoli per testata",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#1a64e4", "#1c415c", "#5a4122", "#447533", "#e3832c", "#bc4f6e", "#a398bb", "#eaeaea"],
                data: [percentuale[1], percentuale[2], percentuale[3], percentuale[4], percentuale[5], percentuale[6], percentuale[7], percentuale[8], percentuale[9], percentuale[10], percentuale[11], percentuale[12], percentuale[13], percentuale[14], percentuale[15], percentuale[16], percentuale[17], percentuale[18], percentuale[19], percentuale[20], percentuale[21], percentuale[22], percentuale[23], percentuale[24], percentuale[25], percentuale[26], percentuale[27], percentuale[28], percentuale[29], percentuale[30], percentuale[31], percentuale[32]]
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

    let spaceFlightInsider = stats.filter(element => {
        if (element.sito == 'SpaceFlight Insider') {
            return element.mese + element.articoli
        }
    })

    let nasaSpaceflight = stats.filter(element => {
        if (element.sito == 'NASA Spaceflight') {
            return element.mese + element.articoli
        }
    })

    let spaceX = stats.filter(element => {
        if (element.sito == 'SpaceX') {
            return element.mese + element.articoli
        }
    })

    let elonX = stats.filter(element => {
        if (element.sito == 'ElonX') {
            return element.mese + element.articoli
        }
    })

    let blueOrigin = stats.filter(element => {
        if (element.sito == 'Blue Origin') {
            return element.mese + element.articoli
        }
    })

    let spaceCom = stats.filter(element => {
        if (element.sito == 'Space.com') {
            return element.mese + element.articoli
        }
    })

    let spaceFlightNow = stats.filter(element => {
        if (element.sito == 'Spaceflight Now') {
            return element.mese + element.articoli
        }
    })

    let teslarati = stats.filter(element => {
        if (element.sito == 'Teslarati') {
            return element.mese + element.articoli
        }
    })

    let virginGalactic = stats.filter(element => {
        if (element.sito == 'Virgin Galactic') {
            return element.mese + element.articoli
        }
    })

    let phys = stats.filter(element => {
        if (element.sito == 'Phys') {
            return element.mese + element.articoli
        }
    })

    let japanTimes = stats.filter(element => {
        if (element.sito == 'The Japan Times') {
            return element.mese + element.articoli
        }
    })

    let nationalGeographic = stats.filter(element => {
        if (element.sito == 'National Geographic') {
            return element.mese + element.articoli
        }
    })

    let spaceNews = stats.filter(element => {
        if (element.sito == 'SpaceNews') {
            return element.mese + element.articoli
        }
    })

    let theNational = stats.filter(element => {
        if (element.sito == 'The National') {
            return element.mese + element.articoli
        }
    })

    let nasa = stats.filter(element => {
        if (element.sito == 'NASA') {
            return element.mese + element.articoli
        }
    })

    let spaceReview = stats.filter(element => {
        if (element.sito == 'The Space Review') {
            return element.mese + element.articoli
        }
    })

    let theVerge = stats.filter(element => {
        if (element.sito == 'The Verge') {
            return element.mese + element.articoli
        }
    })

    let theDrive = stats.filter(element => {
        if (element.sito == 'The Drive') {
            return element.mese + element.articoli
        }
    })

    let arstechnica = stats.filter(element => {
        if (element.sito == 'Arstechnica') {
            return element.mese + element.articoli
        }
    })

    let esa = stats.filter(element => {
        if (element.sito == 'ESA') {
            return element.mese + element.articoli
        }
    })

    let spaceDevs = stats.filter(element => {
        if (element.sito == 'The Space Devs') {
            return element.mese + element.articoli
        }
    })

    let americaSpace = stats.filter(element => {
        if (element.sito == 'AmericaSpace') {
            return element.mese + element.articoli
        }
    })

    let wallStreetJournal = stats.filter(element => {
        if (element.sito == 'The Wall Street Journal') {
            return element.mese + element.articoli
        }
    })

    let cnbc = stats.filter(element => {
        if (element.sito == 'CNBC') {
            return element.mese + element.articoli
        }
    })

    let reuters = stats.filter(element => {
        if (element.sito == 'Reuters') {
            return element.mese + element.articoli
        }
    })

    let euronews = stats.filter(element => {
        if (element.sito == 'euronews') {
            return element.mese + element.articoli
        }
    })

    const nasaSpaceflightChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'NASA Spaceflight',
            data: [nasaSpaceflight[0]['articoli'], nasaSpaceflight[1]['articoli'], nasaSpaceflight[2]['articoli'], nasaSpaceflight[3]['articoli'], nasaSpaceflight[4]['articoli'], nasaSpaceflight[5]['articoli'], nasaSpaceflight[6]['articoli'], nasaSpaceflight[7]['articoli'], nasaSpaceflight[8]['articoli'], nasaSpaceflight[9]['articoli'], nasaSpaceflight[10]['articoli'], nasaSpaceflight[11]['articoli']],
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
    new Chart(document.querySelector('#nasaSpaceflightChart'), {
        type: 'bar',
        data: nasaSpaceflightChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const euronewsChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'euronews',
            data: [euronews[0]['articoli'], euronews[1]['articoli'], euronews[2]['articoli'], euronews[3]['articoli'], euronews[4]['articoli'], euronews[5]['articoli'], euronews[6]['articoli'], euronews[7]['articoli'], euronews[8]['articoli'], euronews[9]['articoli'], euronews[10]['articoli'], euronews[11]['articoli']],
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
    new Chart(document.querySelector('#euronewsChart'), {
        type: 'bar',
        data: euronewsChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const reutersChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Reuters',
            data: [reuters[0]['articoli'], reuters[1]['articoli'], reuters[2]['articoli'], reuters[3]['articoli'], reuters[4]['articoli'], reuters[5]['articoli'], reuters[6]['articoli'], reuters[7]['articoli'], reuters[8]['articoli'], reuters[9]['articoli'], reuters[10]['articoli'], reuters[11]['articoli']],
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
    new Chart(document.querySelector('#reutersChart'), {
        type: 'bar',
        data: reutersChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const cnbcChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'CNBC',
            data: [cnbc[0]['articoli'], cnbc[1]['articoli'], cnbc[2]['articoli'], cnbc[3]['articoli'], cnbc[4]['articoli'], cnbc[5]['articoli'], cnbc[6]['articoli'], cnbc[7]['articoli'], cnbc[8]['articoli'], cnbc[9]['articoli'], cnbc[10]['articoli'], cnbc[11]['articoli']],
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
    new Chart(document.querySelector('#cnbcChart'), {
        type: 'bar',
        data: cnbcChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const wallStreetJournalChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Wall Street Journal',
            data: [wallStreetJournal[0]['articoli'], wallStreetJournal[1]['articoli'], wallStreetJournal[2]['articoli'], wallStreetJournal[3]['articoli'], wallStreetJournal[4]['articoli'], wallStreetJournal[5]['articoli'], wallStreetJournal[6]['articoli'], wallStreetJournal[7]['articoli'], wallStreetJournal[8]['articoli'], wallStreetJournal[9]['articoli'], wallStreetJournal[10]['articoli'], wallStreetJournal[11]['articoli']],
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
    new Chart(document.querySelector('#theWallStreetJournalChart'), {
        type: 'bar',
        data: wallStreetJournalChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const americaSpaceChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'AmericaSpace',
            data: [americaSpace[0]['articoli'], americaSpace[1]['articoli'], americaSpace[2]['articoli'], americaSpace[3]['articoli'], americaSpace[4]['articoli'], americaSpace[5]['articoli'], americaSpace[6]['articoli'], americaSpace[7]['articoli'], americaSpace[8]['articoli'], americaSpace[9]['articoli'], americaSpace[10]['articoli'], americaSpace[11]['articoli']],
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
    new Chart(document.querySelector('#americaSpaceChart'), {
        type: 'bar',
        data: americaSpaceChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceDevsChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Space Devs',
            data: [spaceDevs[0]['articoli'], spaceDevs[1]['articoli'], spaceDevs[2]['articoli'], spaceDevs[3]['articoli'], spaceDevs[4]['articoli'], spaceDevs[5]['articoli'], spaceDevs[6]['articoli'], spaceDevs[7]['articoli'], spaceDevs[8]['articoli'], spaceDevs[9]['articoli'], spaceDevs[10]['articoli'], spaceDevs[11]['articoli']],
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
    new Chart(document.querySelector('#theSpaceDevsChart'), {
        type: 'bar',
        data: spaceDevsChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const esaChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'ESA',
            data: [esa[0]['articoli'], esa[1]['articoli'], esa[2]['articoli'], esa[3]['articoli'], esa[4]['articoli'], esa[5]['articoli'], esa[6]['articoli'], esa[7]['articoli'], esa[8]['articoli'], esa[9]['articoli'], esa[10]['articoli'], esa[11]['articoli']],
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
    new Chart(document.querySelector('#esaChart'), {
        type: 'bar',
        data: esaChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const arstechnicaChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Arstechnica',
            data: [arstechnica[0]['articoli'], arstechnica[1]['articoli'], arstechnica[2]['articoli'], arstechnica[3]['articoli'], arstechnica[4]['articoli'], arstechnica[5]['articoli'], arstechnica[6]['articoli'], arstechnica[7]['articoli'], arstechnica[8]['articoli'], arstechnica[9]['articoli'], arstechnica[10]['articoli'], arstechnica[11]['articoli']],
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
    new Chart(document.querySelector('#arstechnicaChart'), {
        type: 'bar',
        data: arstechnicaChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const theDriveChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Drive',
            data: [theDrive[0]['articoli'], theDrive[1]['articoli'], theDrive[2]['articoli'], theDrive[3]['articoli'], theDrive[4]['articoli'], theDrive[5]['articoli'], theDrive[6]['articoli'], theDrive[7]['articoli'], theDrive[8]['articoli'], theDrive[9]['articoli'], theDrive[10]['articoli'], theDrive[11]['articoli']],
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
    new Chart(document.querySelector('#theDriveChart'), {
        type: 'bar',
        data: theDriveChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const theVergeChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Verge',
            data: [theVerge[0]['articoli'], theVerge[1]['articoli'], theVerge[2]['articoli'], theVerge[3]['articoli'], theVerge[4]['articoli'], theVerge[5]['articoli'], theVerge[6]['articoli'], theVerge[7]['articoli'], theVerge[8]['articoli'], theVerge[9]['articoli'], theVerge[10]['articoli'], theVerge[11]['articoli']],
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
    new Chart(document.querySelector('#theVergeChart'), {
        type: 'bar',
        data: theVergeChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceReviewChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Space Review',
            data: [spaceReview[0]['articoli'], spaceReview[1]['articoli'], spaceReview[2]['articoli'], spaceReview[3]['articoli'], spaceReview[4]['articoli'], spaceReview[5]['articoli'], spaceReview[6]['articoli'], spaceReview[7]['articoli'], spaceReview[8]['articoli'], spaceReview[9]['articoli'], spaceReview[10]['articoli'], spaceReview[11]['articoli']],
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
    new Chart(document.querySelector('#theSpaceReviewChart'), {
        type: 'bar',
        data: spaceReviewChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const nasaChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'NASA',
            data: [nasa[0]['articoli'], nasa[1]['articoli'], nasa[2]['articoli'], nasa[3]['articoli'], nasa[4]['articoli'], nasa[5]['articoli'], nasa[6]['articoli'], nasa[7]['articoli'], nasa[8]['articoli'], nasa[9]['articoli'], nasa[10]['articoli'], nasa[11]['articoli']],
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
    new Chart(document.querySelector('#nasaChart'), {
        type: 'bar',
        data: nasaChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const theNationalChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The National',
            data: [theNational[0]['articoli'], theNational[1]['articoli'], theNational[2]['articoli'], theNational[3]['articoli'], theNational[4]['articoli'], theNational[5]['articoli'], theNational[6]['articoli'], theNational[7]['articoli'], theNational[8]['articoli'], theNational[9]['articoli'], theNational[10]['articoli'], theNational[11]['articoli']],
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
    new Chart(document.querySelector('#theNationalChart'), {
        type: 'bar',
        data: theNationalChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceNewsChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'SpaceNews',
            data: [spaceNews[0]['articoli'], spaceNews[1]['articoli'], spaceNews[2]['articoli'], spaceNews[3]['articoli'], spaceNews[4]['articoli'], spaceNews[5]['articoli'], spaceNews[6]['articoli'], spaceNews[7]['articoli'], spaceNews[8]['articoli'], spaceNews[9]['articoli'], spaceNews[10]['articoli'], spaceNews[11]['articoli']],
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
    new Chart(document.querySelector('#spaceNewsChart'), {
        type: 'bar',
        data: spaceNewsChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const nationalGeographicChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'National Geographic',
            data: [nationalGeographic[0]['articoli'], nationalGeographic[1]['articoli'], nationalGeographic[2]['articoli'], nationalGeographic[3]['articoli'], nationalGeographic[4]['articoli'], nationalGeographic[5]['articoli'], nationalGeographic[6]['articoli'], nationalGeographic[7]['articoli'], nationalGeographic[8]['articoli'], nationalGeographic[9]['articoli'], nationalGeographic[10]['articoli'], nationalGeographic[11]['articoli']],
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
    new Chart(document.querySelector('#nationalGeographicChart'), {
        type: 'bar',
        data: nationalGeographicChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const japanTimesChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'The Japan Times',
            data: [japanTimes[0]['articoli'], japanTimes[1]['articoli'], japanTimes[2]['articoli'], japanTimes[3]['articoli'], japanTimes[4]['articoli'], japanTimes[5]['articoli'], japanTimes[6]['articoli'], japanTimes[7]['articoli'], japanTimes[8]['articoli'], japanTimes[9]['articoli'], japanTimes[10]['articoli'], japanTimes[11]['articoli']],
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
    new Chart(document.querySelector('#theJapanTimesChart'), {
        type: 'bar',
        data: japanTimesChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const physChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Phys',
            data: [phys[0]['articoli'], phys[1]['articoli'], phys[2]['articoli'], phys[3]['articoli'], phys[4]['articoli'], phys[5]['articoli'], phys[6]['articoli'], phys[7]['articoli'], phys[8]['articoli'], phys[9]['articoli'], phys[10]['articoli'], phys[11]['articoli']],
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
    new Chart(document.querySelector('#physChart'), {
        type: 'bar',
        data: physChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const virginGalacticChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Virgin Galactic',
            data: [virginGalactic[0]['articoli'], virginGalactic[1]['articoli'], virginGalactic[2]['articoli'], virginGalactic[3]['articoli'], virginGalactic[4]['articoli'], virginGalactic[5]['articoli'], virginGalactic[6]['articoli'], virginGalactic[7]['articoli'], virginGalactic[8]['articoli'], virginGalactic[9]['articoli'], virginGalactic[10]['articoli'], virginGalactic[11]['articoli']],
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
    new Chart(document.querySelector('#virginGalaticChart'), {
        type: 'bar',
        data: virginGalacticChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const teslaratiChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Teslarati',
            data: [teslarati[0]['articoli'], teslarati[1]['articoli'], teslarati[2]['articoli'], teslarati[3]['articoli'], teslarati[4]['articoli'], teslarati[5]['articoli'], teslarati[6]['articoli'], teslarati[7]['articoli'], teslarati[8]['articoli'], teslarati[9]['articoli'], teslarati[10]['articoli'], teslarati[11]['articoli']],
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
    new Chart(document.querySelector('#teslaratiChart'), {
        type: 'bar',
        data: teslaratiChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceFlightNowChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Spaceflight Now',
            data: [spaceFlightNow[0]['articoli'], spaceFlightNow[1]['articoli'], spaceFlightNow[2]['articoli'], spaceFlightNow[3]['articoli'], spaceFlightNow[4]['articoli'], spaceFlightNow[5]['articoli'], spaceFlightNow[6]['articoli'], spaceFlightNow[7]['articoli'], spaceFlightNow[8]['articoli'], spaceFlightNow[9]['articoli'], spaceFlightNow[10]['articoli'], spaceFlightNow[11]['articoli']],
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
    new Chart(document.querySelector('#spaceflightNowChart'), {
        type: 'bar',
        data: spaceFlightNowChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceComChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Space.com',
            data: [spaceCom[0]['articoli'], spaceCom[1]['articoli'], spaceCom[2]['articoli'], spaceCom[3]['articoli'], spaceCom[4]['articoli'], spaceCom[5]['articoli'], spaceCom[6]['articoli'], spaceCom[7]['articoli'], spaceCom[8]['articoli'], spaceCom[9]['articoli'], spaceCom[10]['articoli'], spaceCom[11]['articoli']],
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
    new Chart(document.querySelector('#spaceComChart'), {
        type: 'bar',
        data: spaceComChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const blueOriginChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Blue Origin',
            data: [blueOrigin[0]['articoli'], blueOrigin[1]['articoli'], blueOrigin[2]['articoli'], blueOrigin[3]['articoli'], blueOrigin[4]['articoli'], blueOrigin[5]['articoli'], blueOrigin[6]['articoli'], blueOrigin[7]['articoli'], blueOrigin[8]['articoli'], blueOrigin[9]['articoli'], blueOrigin[10]['articoli'], blueOrigin[11]['articoli']],
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
    new Chart(document.querySelector('#blueOriginChart'), {
        type: 'bar',
        data: blueOriginChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const spaceXchart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'Spacex',
            data: [spaceX[0]['articoli'], spaceX[1]['articoli'], spaceX[2]['articoli'], spaceX[3]['articoli'], spaceX[4]['articoli'], spaceX[5]['articoli'], spaceX[6]['articoli'], spaceX[7]['articoli'], spaceX[8]['articoli'], spaceX[9]['articoli'], spaceX[10]['articoli'], spaceX[11]['articoli']],
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
    new Chart(document.querySelector('#spaceXchart'), {
        type: 'bar',
        data: spaceXchart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })


    const elonXchart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'ElonX',
            data: [elonX[0]['articoli'], elonX[1]['articoli'], elonX[2]['articoli'], elonX[3]['articoli'], elonX[4]['articoli'], elonX[5]['articoli'], elonX[6]['articoli'], elonX[7]['articoli'], elonX[8]['articoli'], elonX[9]['articoli'], elonX[10]['articoli'], elonX[11]['articoli']],
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
    new Chart(document.querySelector('#elonXchart'), {
        type: 'bar',
        data: elonXchart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })


    const spaceFlightInsiderChart = {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: 'SpaceFlight Insider',
            data: [spaceFlightInsider[0]['articoli'], spaceFlightInsider[1]['articoli'], spaceFlightInsider[2]['articoli'], spaceFlightInsider[3]['articoli'], spaceFlightInsider[4]['articoli'], spaceFlightInsider[5]['articoli'], spaceFlightInsider[6]['articoli'], spaceFlightInsider[7]['articoli'], spaceFlightInsider[8]['articoli'], spaceFlightInsider[9]['articoli'], spaceFlightInsider[10]['articoli'], spaceFlightInsider[11]['articoli']],
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
    new Chart(document.querySelector('#spaceFlightInsiderChart'), {
        type: 'bar',
        data: spaceFlightInsiderChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}






monthlyData()




statistics.addEventListener('click', event => {
    graficoTorta.style.display = 'initial';
    document.querySelector('#spaceFlightInsiderChart').style.display = 'initial';
    document.querySelector('#nasaSpaceflightChart').style.display = 'initial';
    document.querySelector('#spaceXchart').style.display = 'initial';
    document.querySelector('#elonXchart').style.display = 'initial';
    document.querySelector('#blueOriginChart').style.display = 'initial';
    document.querySelector('#spaceflightNowChart').style.display = 'initial';
    document.querySelector('#spaceComChart').style.display = 'initial';
    document.querySelector('#teslaratiChart').style.display = 'initial';
    document.querySelector('#virginGalaticChart').style.display = 'initial';
    document.querySelector('#physChart').style.display = 'initial';
    document.querySelector('#theJapanTimesChart').style.display = 'initial';
    document.querySelector('#nationalGeographicChart').style.display = 'initial';
    document.querySelector('#spaceNewsChart').style.display = 'initial';
    document.querySelector('#theNationalChart').style.display = 'initial';
    document.querySelector('#nasaChart').style.display = 'initial';
    document.querySelector('#theSpaceReviewChart').style.display = 'initial';
    document.querySelector('#theVergeChart').style.display = 'initial';
    document.querySelector('#theDriveChart').style.display = 'initial';
    document.querySelector('#arstechnicaChart').style.display = 'initial';
    document.querySelector('#esaChart').style.display = 'initial';
    document.querySelector('#theSpaceDevsChart').style.display = 'initial';
    document.querySelector('#americaSpaceChart').style.display = 'initial';
    document.querySelector('#theWallStreetJournalChart').style.display = 'initial';
    document.querySelector('#cnbcChart').style.display = 'initial';
    document.querySelector('#reutersChart').style.display = 'initial';
    document.querySelector('#euronewsChart').style.display = 'initial';
})
