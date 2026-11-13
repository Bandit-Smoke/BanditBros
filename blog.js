// blog.js — renders blog posts from config.json
// Works on two pages:
//   index.html -> fills #blog-container with the latest post cards
//   post.html  -> fills #post-container with the full post (post.html?id=<post id>)

(function () {
    const CONFIG_URL = 'config.json';
    const MAX_HOME_POSTS = 3; // how many cards to show on the homepage

    // "2026-10-10" -> "October 10, 2026" (parsed by hand so time zones can't shift the day)
    function formatDate(iso) {
        const parts = String(iso || '').split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return iso || '';
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Newest first. Posts with "hidden": true are skipped.
    function getVisiblePosts(config) {
        return (config.posts || [])
            .filter(function (p) { return !p.hidden; })
            .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
    }

    // content can be an array of paragraphs, or one string (blank line = new paragraph)
    function getParagraphs(post) {
        if (Array.isArray(post.content)) return post.content;
        if (typeof post.content === 'string' && post.content.trim()) return post.content.split(/\n\s*\n/);
        return [];
    }

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    async function loadConfig() {
        const res = await fetch(CONFIG_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Could not load ' + CONFIG_URL + ' (' + res.status + ')');
        return res.json();
    }

    // ---------- Homepage cards ----------
    function renderHome(container, posts) {
        container.innerHTML = '';

        if (posts.length === 0) {
            container.appendChild(el('p', 'blog-empty', 'No posts yet. Check back soon!'));
            return;
        }

        posts.slice(0, MAX_HOME_POSTS).forEach(function (post) {
            const card = el('article', 'blog-card');
            card.appendChild(el('span', 'blog-date', formatDate(post.date)));
            card.appendChild(el('h3', null, post.title));
            card.appendChild(el('p', null, post.summary || ''));

            // Only show Read More if the post actually has a full body
            if (getParagraphs(post).length > 0) {
                const link = el('a', null, 'Read More →');
                link.href = 'post.html?id=' + encodeURIComponent(post.id);
                card.appendChild(link);
            }

            container.appendChild(card);
        });
    }

    // ---------- Full post page ----------
    function renderPost(container, posts) {
        const id = new URLSearchParams(window.location.search).get('id');
        const post = posts.find(function (p) { return p.id === id; });

        container.innerHTML = '';

        if (!post) {
            document.title = 'Post not found | Bandit Bros';
            container.appendChild(el('h1', null, 'Post not found'));
            container.appendChild(el('p', null, "We couldn't find that post. It may have been removed."));
            const back = el('a', 'post-back', '← Back to news');
            back.href = 'index.html#news';
            container.appendChild(back);
            return;
        }

        document.title = post.title + ' | Bandit Bros';

        const back = el('a', 'post-back', '← Back to news');
        back.href = 'index.html#news';
        container.appendChild(back);

        container.appendChild(el('span', 'blog-date', formatDate(post.date)));
        container.appendChild(el('h1', 'post-title', post.title));

        if (post.image) {
            const img = el('img', 'post-image');
            img.src = post.image;
            img.alt = post.title;
            container.appendChild(img);
        }

        const body = el('div', 'post-body');
        getParagraphs(post).forEach(function (text) {
            const p = document.createElement('p');
            p.innerHTML = text; // your own config, so <strong>, <a>, etc. are allowed
            body.appendChild(p);
        });
        container.appendChild(body);
    }

    // ---------- Start ----------
    async function init() {
        const home = document.getElementById('blog-container');
        const full = document.getElementById('post-container');
        if (!home && !full) return;

        try {
            const posts = getVisiblePosts(await loadConfig());
            if (home) renderHome(home, posts);
            if (full) renderPost(full, posts);
        } catch (err) {
            console.error(err);
            const target = home || full;
            target.innerHTML = '';
            target.appendChild(el('p', 'blog-empty', "Couldn't load posts right now. Try refreshing the page."));
        }
    }

    init();
})();