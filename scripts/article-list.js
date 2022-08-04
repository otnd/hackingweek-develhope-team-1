const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById("next-button");
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const select = document.getElementById('table-filter');
const baseUrl = 'https://api.spaceflightnewsapi.net/v3/articles';
const articleSection = document.getElementById('article-section')
const articleBtn = document.getElementById('article-list')

//mostra la tabella al click
articleBtn.addEventListener('click', () => {
  articleSection.classList.remove('d-none')
})


async function createTable(endpoint) {
  //richiede gli articoli; 
  const response = await fetch(endpoint);
  const articles = await response.json();

  //genera la tabella in base agli articoli fetchati;
  articles.forEach(article => {
    //crea una riga per ogni elemento;
    const tr = document.createElement('tr');
    tr.classList.add('dd-block')
    tbody.append(tr);
    //crea 4 celle per ogni riga;
    for (i = 0; i < 4; i++) {
      const td = document.createElement('td');
      td.classList.add('dd-block', 'bordo-0', 'head-space', 'etichette', 'right-align')
      tr.append(td);

      //queste condizioni permettono di disporre dinamicamente ogni contenuto, per tipologia, nella sua colonna;
      if (i == 0) {
        const img = document.createElement('img');
        img.setAttribute('src', `${article.imageUrl}`);
        img.setAttribute('width', '100px');
        td.append(img);
      }
      if (i == 1) {
        td.innerHTML = article.title;
      }
      if (i == 2) {
        const date = article.publishedAt.slice(0, 10);
        td.innerHTML = date;
      }
      if (i == 3) {
        const anchor = document.createElement('a');
        anchor.setAttribute('href', `${article.url}`);
        anchor.classList.add('text-decoration-none', 'link-primary');
        td.append(anchor);
        anchor.innerHTML = 'Vai alla pagina';
      }
    }
  })
}

createTable(baseUrl);

//variabile che ci permette di gestire l'impaginazione
let skipArticle = 0;

//questi due event listener permettono di sfogliare la tabella, muovendosi tra le pagine;
nextButton.addEventListener('click', () => {
  if (skipArticle == 0) {
    previousButton.classList.remove('text-muted');
  }
  tbody.innerHTML = '';
  skipArticle += 10;
  pageNumber.innerHTML = `${skipArticle / 10}`
  const nextBaseUrl = `${baseUrl}?_start=${skipArticle}`;
  createTable(nextBaseUrl);
})

previousButton.addEventListener('click', () => {
  if (skipArticle == 0) {
    return;
  }
  if (skipArticle == 10) {
    pageNumber.innerHTML = `0`
    tbody.innerHTML = '';
    createTable(baseUrl);
    skipArticle = 0
    previousButton.classList.add('text-muted');
  } else {
    tbody.innerHTML = '';
    skipArticle -= 10;
    pageNumber.innerHTML = `${skipArticle / 10}`
    const previousBaseUrl = `${baseUrl}?_start=${skipArticle}`;
    createTable(previousBaseUrl);
  }
})

//recupera la lista delle opzioni disponibili all'endpoint /info;
async function getOption() {
  const response = await fetch('https://api.spaceflightnewsapi.net/v3/info')
  const data = await response.json();
  const sources = data.newsSites;
  //crea un'opzione per ogni elemento dell'array
  sources.map(source => {
    const option = document.createElement('option');
    option.setAttribute('value', `${sources.indexOf(source)}`);
    option.textContent = `${source}`;
    select.append(option);
  })
}
getOption();

//al cambio di opzione, la tabella viene ricreata e l'url viene parametrizzato con la proprietà value del nodo 'select'
select.addEventListener('change', () => {
  let selectUrl = `https://api.spaceflightnewsapi.net/v3/articles?newsSite_contains=${select.value}`
  tbody.innerHTML = ''
  createTable(selectUrl)
})

//download csv
function downloadCsv(separator = ',') {
  let rows = document.querySelectorAll('tr');
  let csv = [];
  for (let x = 0; x < rows.length; x++) {
      let row = []; 
      let cols = rows[x].querySelectorAll('td, th');
      for (let y = 0; y < cols.length; y++) {
          let data = cols[y].innerText;
          row.push('"' + data + '"');
      }
      csv.push(row.join(separator));
  }
  let csvStr = csv.join('\n');
  let filename = 'export_'+ new Date().toLocaleDateString() + '.csv';
  let downloadLink = document.createElement('a');
  downloadLink.style.display = 'none';
  downloadLink.setAttribute('target', '_blank');
  downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr));
  downloadLink.setAttribute('download', filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const pageNumber = document.querySelector('#number-page');
