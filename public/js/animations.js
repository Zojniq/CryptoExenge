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
})();
