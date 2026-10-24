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

    const symbols = { UAH: '₴', EUR: '€', USD: '$' };
    const nf = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
    const nf2 = new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const parseAmount = (v) => Number(String(v).replace(/\D/g, '')) || 0;

    function getActiveRate(crypto, code) {
        if (rates[crypto] && rates[crypto][code] !== undefined) {
            return Number(rates[crypto][code]) || 0;
        }

        let rawRate = rates[code];
        if (typeof rawRate === 'object' && rawRate !== null) {
            rawRate = rawRate[code] || Object.values(rawRate)[0];
        }
        return Number(rawRate) || 0;
    }

    function update() {
        const code = currencyEl ? currencyEl.value : 'UAH';
        const crypto = cryptoEl ? cryptoEl.selectedOptions[0].dataset.code : 'USDT';
        const rate = getActiveRate(crypto, code);

        const currentAmount = amountEl ? parseAmount(amountEl.value) : 0;
        const totalCrypto = rate > 0 ? currentAmount / rate : 0;

        if (fiatCoinEl) {
            fiatCoinEl.textContent = symbols[code] || code[0] || '₴';
        }

        if (cryptoNameEl) {
            cryptoNameEl.textContent = crypto;
        }

        if (cryptoHintEl && cryptoEl && cryptoEl.selectedOptions[0]) {
            const network = cryptoEl.selectedOptions[0].dataset.network || '';
            cryptoHintEl.textContent = network ? `Мережа ${network}` : '';
        }

        if (rateLineEl) {
            rateLineEl.textContent = `1 ${crypto} ≈ ${nf2.format(rate)} ${code}`;
        }

        if (resultLineEl) {
            resultLineEl.textContent = `~${nf.format(totalCrypto)} ${crypto}`;
        }
    }

    // Форматування суми із захистом від стрибків курсора
    if (amountEl) {
        amountEl.addEventListener('input', () => {
            const cursor = amountEl.selectionStart;
            const prevLen = amountEl.value.length;
            const numericValue = parseAmount(amountEl.value);

            amountEl.value = numericValue > 0 ? nf.format(numericValue).replace(/\u00a0/g, ' ') : '';

            const newLen = amountEl.value.length;
            const newCursor = Math.max(0, cursor + (newLen - prevLen));
            amountEl.setSelectionRange(newCursor, newCursor);

            update();
        });
    }

    if (currencyEl) currencyEl.addEventListener('change', update);
    if (cryptoEl) cryptoEl.addEventListener('change', update);

    // Дата за замовчуванням
    if (dateEl) {
        const today = new Date();
        const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
        dateEl.min = iso;
        if (!dateEl.value) {
            dateEl.value = iso;
        }
    }

    // Валідація та очищення суми перед надсиланням на сервер
    form.addEventListener('submit', (e) => {
        if (amountEl) {
            const cleanAmount = parseAmount(amountEl.value);
            if (cleanAmount <= 0) {
                e.preventDefault();
                amountEl.focus();
                return;
            }
            amountEl.value = cleanAmount;
        }
    });


    update();
})();
