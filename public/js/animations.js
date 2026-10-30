(() => {
    if (!window.gsap || !window.SplitText) return;

    gsap.registerPlugin(SplitText);

    const mm = gsap.matchMedia();

    // Анімації лише для тих, хто не просив зменшити рух
    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const titles = document.querySelectorAll('.mainContent-text h2');
        if (!titles.length) return;

        const rest = document.querySelectorAll(
            '.mainContent-text > p, .features-list li, .stats > div, .how .step'
        );

        gsap.set(titles, { autoAlpha: 0 });
        gsap.set(rest, { autoAlpha: 0, y: 16 });

        // Ділимо на рядки лише після завантаження шрифту, інакше рядки будуть інші
        document.fonts.ready.then(() => {
            const split = SplitText.create(titles, { type: 'lines', mask: 'lines' });
            gsap.set(titles, { autoAlpha: 1 });

            // Заголовок виїжджає з маски по рядках, решта з'являється слідом
            gsap.timeline()
                .from(split.lines, { yPercent: 110, duration: 0.8, ease: 'power4.out', stagger: 0.08 })
                .to(rest, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }, 0.2);
        });
    });

    // Ефекти за курсором — лише на пристроях з мишкою
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const card = document.querySelector('.exchange');
        const btn = document.querySelector('.exchange .submit');
        if (!card || !btn) return;

        // Картка: легкий 3D-нахил + лаймова підсвітка за курсором
        gsap.set(card, { transformPerspective: 1000 });
        const tiltY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
        const tiltX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });

        const onCardMove = (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
            const y = (e.clientY - r.top) / r.height - 0.5;
            tiltY(x * 6);
            tiltX(-y * 6);
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
            card.classList.add('is-lit');
        };
        const onCardLeave = () => {
            tiltY(0);
            tiltX(0);
            card.classList.remove('is-lit');
        };

        // Кнопка: трохи тягнеться до курсора
        const pullX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.6)' });
        const pullY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.6)' });

        const onBtnMove = (e) => {
            const r = btn.getBoundingClientRect();
            pullX((e.clientX - (r.left + r.width / 2)) * 0.06);
            pullY((e.clientY - (r.top + r.height / 2)) * 0.25);
        };
        const onBtnLeave = () => {
            pullX(0);
            pullY(0);
        };

        card.addEventListener('pointermove', onCardMove);
        card.addEventListener('pointerleave', onCardLeave);
        btn.addEventListener('pointermove', onBtnMove);
        btn.addEventListener('pointerleave', onBtnLeave);

        // Прибрати обробники, якщо умова медіазапиту перестала діяти
        return () => {
            card.removeEventListener('pointermove', onCardMove);
            card.removeEventListener('pointerleave', onCardLeave);
            btn.removeEventListener('pointermove', onBtnMove);
            btn.removeEventListener('pointerleave', onBtnLeave);
            card.classList.remove('is-lit');
        };
    });
})();
