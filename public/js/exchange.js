(() => {
    const form = document.getElementById('exchange-form');
    if (!form) return;

    let rates = { UAH: 46.9 };
    try {
        if (form.dataset.rates) {
            rates = JSON.parse(form.dataset.rates);
        }
    } catch (e) {
        console.error('Помилка обробки курсів:', e);
    }

    const amountEl = document.getElementById('amount');
    const currencyEl = document.getElementById('currency');
    const cryptoEl = document.getElementById('crypto');
    const dateEl = document.getElementById('date');
    const fiatCoinEl = document.getElementById('fiat-coin');
    const cryptoNameEl = document.getElementById('crypto-name');
    const cryptoHintEl = document.getElementById('crypto-hint');
    const rateLineEl = document.getElementById('rate-line');
    const resultLineEl = document.getElementById('result-line');

    const symbols = { UAH: '₴', EUR: '€' };
    const nf = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
    const nf2 = new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const parseAmount = (v) => Number(String(v).replace(/\D/g, '')) || 0;

    function update() {
        const code = currencyEl ? currencyEl.value : 'UAH';
        const crypto = cryptoEl ? cryptoEl.value : 'USDT';

        // Безпечне вилучення курсу як чистого числа
        let rawRate = rates[code];
        if (typeof rawRate === 'object' && rawRate !== null) {
            rawRate = rawRate[code] || Object.values(rawRate)[0];
        }
        const rate = Number(rawRate) || 0;

        const currentAmount = amountEl ? parseAmount(amountEl.value) : 0;
        const usdt = rate > 0 ? currentAmount / rate : 0;

        if (fiatCoinEl) fiatCoinEl.textContent = symbols[code] || code[0];
        if (cryptoNameEl) cryptoNameEl.textContent = crypto;

        if (cryptoHintEl && cryptoEl && cryptoEl.selectedOptions[0]) {
            const network = cryptoEl.selectedOptions[0].dataset.network || '';
            cryptoHintEl.textContent = 'Мережа ' + network;
        }

        if (rateLineEl) {
            rateLineEl.textContent = `1 ${crypto} ≈ ${nf2.format(rate)} ${code}`;
        }

        if (resultLineEl) {
            resultLineEl.textContent = `~${nf.format(usdt)} ${crypto}`;
        }
    }

    if (amountEl) {
        amountEl.addEventListener('input', () => {
            amountEl.value = nf.format(parseAmount(amountEl.value)).replace(/\u00a0/g, ' ');
            update();
        });
    }

    if (currencyEl) currencyEl.addEventListener('change', update);
    if (cryptoEl) cryptoEl.addEventListener('change', update);

    if (dateEl) {
        const today = new Date();
        const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
        dateEl.min = iso;
        dateEl.value = iso;
    }

    form.addEventListener('submit', () => {
        if (amountEl) {
            amountEl.value = parseAmount(amountEl.value);
        }
    });

    update();
})();