(() => {
    const btn = document.querySelector('[data-copy]');
    if (!btn) return;

    const textEl = btn.querySelector('.copy-btn__text');
    const defaultText = textEl.textContent;
    let timer;

    // Копіювання номера замовлення в буфер обміну
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(btn.dataset.copy);
            textEl.textContent = 'Скопійовано';
            btn.classList.add('is-done');
        } catch (e) {
            textEl.textContent = 'Не вдалося';
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
            textEl.textContent = defaultText;
            btn.classList.remove('is-done');
        }, 1500);
    });
})();
