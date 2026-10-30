// Каскад деталей: блоки з'являються знизу один за одним, номер — останнім з «pop»
(() => {
    if (!window.gsap) return;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const blocks = document.querySelectorAll(
            '.main-text > *, .order-head, .orderInfo:not(.orderInfo--code), .order-note, .next-steps, .order-actions'
        );
        const code = document.querySelector('.orderInfo--code');

        // 0,3 с — галочка встигає намалюватись (CSS-анімація в order.css)
        gsap.timeline({ delay: 0.3 })
            .from(blocks, { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.07 })
            .from(code, { autoAlpha: 0, scale: 0.94, duration: 0.45, ease: 'back.out(2)' }, '-=0.25');
    });
})();

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
