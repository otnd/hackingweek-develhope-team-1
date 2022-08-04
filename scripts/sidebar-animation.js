const toggleMenu = document.getElementById('toggle-menu')
const nav = document.querySelector('nav')
const overlay = document.getElementById('overlay')
const dayClickWindow = document.getElementById('calendar-window')
const articleSection = document.getElementById('article-section')
const statsSection = document.querySelector('.charts')

function sidebarAnimation() {
    nav.classList.toggle("nav-hide")
    if (dayClickWindow.classList.contains('d-none') === false) {
        return
    }
    else {
        overlay.classList.toggle('d-none')
    }
}

toggleMenu.addEventListener('click', sidebarAnimation)

const calendarBtnEl = document.getElementById('calendar-btn')
const articlesBtnEl = document.getElementById('articles-btn')
const statsBtnEl = document.getElementById('stats-btn')

calendarBtnEl.addEventListener('click', () => {
    document.querySelector('#menu-testate').style.display = 'none';
    articleSection.classList.add('d-none');
    calendarBtnEl.classList.add('active');
    nav.classList.toggle("nav-hide");
    overlay.classList.add('d-none');
    articlesBtnEl.classList.remove('active');
    statsBtnEl.classList.remove('active');
})

articlesBtnEl.addEventListener('click', () => {
    articleSection.classList.remove('d-none');
    articlesBtnEl.classList.add('active');
    nav.classList.toggle("nav-hide");
    overlay.classList.add('d-none');
    calendarBtnEl.classList.remove('active');
    statsBtnEl.classList.remove('active');
})

statsBtnEl.addEventListener('click', () => {
    statsSection.classList.remove('d-none')
    articleSection.classList.add('d-none');
    statsBtnEl.classList.add('active');
    nav.classList.toggle("nav-hide");
    overlay.classList.add('d-none');
    articlesBtnEl.classList.remove('active');
    calendarBtnEl.classList.remove('active');
})




