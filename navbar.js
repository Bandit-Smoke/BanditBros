// navbar.js — runs synchronously, so the navbar is in the DOM before first paint
(function () {
    const navbarHTML = `
<nav class="navbar">
    <ul>
        <li><p> </p></li>
        <li>
            <a href="index.html" class="logo-link" aria-label="Bandit Bros home">
                <img src="images/BanditBrosPhaseWithText2.jpg" width="200" alt="Bandit Bros">
            </a>
        </li>
        <li><p> </p></li>
        <li><a href="index.html">Home</a></li>
        <li><a href="socials.html">Socials</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li>
            <button class="theme-button" aria-label="Toggle theme">
                <span class="material-symbols-outlined">dark_mode</span>
            </button>
        </li>
    </ul>
</nav>`;

    const placeholder = document.getElementById("navbar-placeholder");
    if (placeholder) placeholder.outerHTML = navbarHTML;

    // ---- THEME TOGGLE ----
    // Minimal version. If your old navbar.js had its own dark mode logic,
    // paste that here instead.
    const btn = document.querySelector(".theme-button");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("darkmode");
    }
    if (btn) {
        btn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("darkmode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
})();