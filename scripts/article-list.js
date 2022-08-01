let table = document.querySelector('table');
  let tbody = document.querySelector('tbody');

  async function createTable(){ 
  let response = await fetch('https://api.spaceflightnewsapi.net/v3/articles')
    console.log(response);
  let articles = await response.json();
  console.log(articles)
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
      let strDate = article.publishedAt.split('')
      let data = article.publishedAt.slice(0,10)
      console.log(strDate)
      console.log(data)
      td.innerHTML = data;
    }
    if(i == 3) {
      let url = document.createElement('a')
      url.setAttribute('href', `${article.url}`)
      td.append(url)
      url.innerHTML = 'Vai alla pagina'
    }
    }
    console.log(tr)
    
    })
  }
  createTable();