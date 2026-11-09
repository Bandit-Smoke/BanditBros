document.addEventListener("DOMContentLoaded", async () => {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    try {
        const response = await fetch("navbar.html");
        if (!response.ok) throw new Error("Failed to load navbar");
        placeholder.innerHTML = await response.text();

        // Optional: highlight the current page's link
        const current = location.pathname.split("/").pop() || "index.html";
        placeholder.querySelectorAll("a").forEach(link => {
            if (link.getAttribute("href") === current) link.classList.add("active");
        });
    } catch (err) {
        console.error(err);
    }
});