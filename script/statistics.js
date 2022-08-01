const statistics = document.querySelector("#statistics");

statistics.addEventListener("click", () => {
    calendar.classList.remove("active")
    articles.classList.remove("active")
    statistics.classList.toggle("active")
});