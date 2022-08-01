let table = document.querySelector('table');
  let tbody = document.querySelector('tbody');
  let baseUrl = 'https://api.spaceflightnewsapi.net/v3/articles';

  async function createTable(endpoint){
  let response = await fetch(endpoint);
    console.log(response);
  let articles = await response.json();
  articles.forEach(article => {
    let tr = document.createElement('tr')
    tbody.append(tr)
    for(i=0; i<4; i++){
    let td = document.createElement('td')
    tr.append(td)
    
    if(i == 0) {
      let img = document.createElement('img')
      img.setAttribute('src', `${article.imageUrl}`)
      img.setAttribute('width', '100px')
      td.append(img)
    }
    if(i == 1) {
      td.innerHTML = article.title;
    }
    if(i == 2) {
      let data = article.publishedAt.slice(0,10)
      td.innerHTML = data;
    }
    if(i == 3) {
      let url = document.createElement('a')
      url.setAttribute('href', `${article.url}`)
      td.append(url)
      url.innerHTML = 'Vai alla pagina'
    }
    }
    })
  }
  createTable(baseUrl);
  
  let skipArticle = 0;
  function nextPage(){
    skipArticle += 10;
  }
  let previousButton = document.getElementById('previous-button')
  let nextButton = document.getElementById("next-button")
  nextButton.addEventListener('click', () => {
    if(skipArticle == 0) {
      previousButton.classList.remove('text-muted')
    }
    tbody.innerHTML = '';
    nextPage()
    let nextBaseUrl = `${baseUrl}?_start=${skipArticle}`
    createTable(nextBaseUrl)
  })
  previousButton.addEventListener('click', () => {
    if(skipArticle == 0){
      return;
    }
    if(skipArticle == 10) {
      tbody.innerHTML = ''
      createTable(baseUrl)
      skipArticle = 0
      previousButton.classList.add('text-muted')
    } else {
      tbody.innerHTML ='';
      skipArticle -= 10;
      let previousBaseUrl = `${baseUrl}?_start=${skipArticle}`
      createTable(previousBaseUrl)
    }

  })
