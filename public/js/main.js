// Мобільне меню: кнопка ☰ відкриває і закриває панель з посиланнями
(() => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    const icon = toggle.querySelector('i');

    const setOpen = (open) => {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
        icon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
    };

    toggle.addEventListener('click', () => {
        setOpen(!nav.classList.contains('is-open'));
    });

    // Закрити після переходу за посиланням або натискання Escape
    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
})();
