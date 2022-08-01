const articles = document.querySelector("#articles");

articles.addEventListener("click", () => {
    calendar.classList.remove("active")
    articles.classList.toggle("active")
    statistics.classList.remove("active")
});
