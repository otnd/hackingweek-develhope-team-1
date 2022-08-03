const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById("next-button");
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const select = document.getElementById('table-filter');
let baseUrl = 'https://api.spaceflightnewsapi.net/v3/articles';
const articleSection = document.getElementById('article-section')
const articleBtn = document.getElementById('article-list')

//mostra la tabella al click
articleBtn.addEventListener('click', () => {
  articleSection.classList.remove('d-none')
})


async function createTable(endpoint) {
  //richiede gli articoli; 
  let response = await fetch(endpoint);
  let articles = await response.json();

  //genera la tabella in base agli articoli fetchati;
  articles.forEach(article => {
    //crea una riga per ogni elemento;
    let tr = document.createElement('tr');
    tbody.append(tr);
    //crea 4 celle per ogni riga;
    for (i = 0; i < 4; i++) {
      let td = document.createElement('td');
      tr.append(td);

      //queste condizioni permettono di disporre dinamicamente ogni contenuto, per tipologia, nella sua colonna;
      if (i == 0) {
        let img = document.createElement('img');
        img.setAttribute('src', `${article.imageUrl}`);
        img.setAttribute('width', '100px');
        td.append(img);
      }
      if (i == 1) {
        td.innerHTML = article.title;
      }
      if (i == 2) {
        let date = article.publishedAt.slice(0, 10);
        td.innerHTML = date;
      }
      if (i == 3) {
        let anchor = document.createElement('a');
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
  let nextBaseUrl = `${baseUrl}?_start=${skipArticle}`;
  createTable(nextBaseUrl);
})

previousButton.addEventListener('click', () => {
  if (skipArticle == 0) {
    return;
  }
  if (skipArticle == 10) {
    tbody.innerHTML = '';
    createTable(baseUrl);
    skipArticle = 0
    previousButton.classList.add('text-muted');
  } else {
    tbody.innerHTML = '';
    skipArticle -= 10;
    let previousBaseUrl = `${baseUrl}?_start=${skipArticle}`;
    createTable(previousBaseUrl);
  }
})

//recupera la lista delle opzioni disponibili all'endpoint /info;
async function getOption() {
  let response = await fetch('https://api.spaceflightnewsapi.net/v3/info')
  let data = await response.json();
  let sources = data.newsSites;
  //crea un'opzione per ogni elemento dell'array
  sources.map(source => {
    let option = document.createElement('option');
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

