const calendar = document.querySelector("#calendar");

calendar.addEventListener("click", () => {
    calendar.classList.toggle("active")
    articles.classList.remove("active")
    statistics.classList.remove("active")
});