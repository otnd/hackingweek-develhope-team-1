const toggleMenu = document.getElementById('toggle-menu')
const nav = document.querySelector('nav')
const overlay = document.getElementById('overlay')

function sidebarAnimation (){
    nav.classList.toggle("nav-hide")
    overlay.classList.toggle("overlay-hide")
}

toggleMenu.addEventListener('click', sidebarAnimation)




