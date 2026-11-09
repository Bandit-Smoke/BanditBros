
const themebutton = document.querySelector(".theme-button")
document.body.classList.toggle("darkmode");
themebutton.addEventListener("click", () => {
    document.body.classList.toggle("darkmode");
})