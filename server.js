import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const data = {
    title: 'ВЕКТОР — криптообмінник',
    methods: [
        { id: 'cash', title: 'Готівка в обміннику', text: 'Резервуй суму на обрану дату й забери особисто' },
        // { id: 'p2p', title: 'P2P обмін', text: 'Обмін без фізичного візиту — онлайн між сторонами' },
    ],
    cryptos: [
        { code: 'USDT', network: 'TRON · TRC-20' },
        { code: 'USDC', network: 'Polygon' },
    ],
    branches: [
        { id: 'kyiv-zoloti-vorota', name: 'Київ, м. Золоті Ворота 2' },
        { id: 'kyiv-maidan', name: 'Київ, м. Майдан Незалежності 1' },
      { id: 'kyiv-golosievo', name: 'Київ, вул. Голосіївський проспект 17А' }
    ],
    slots: ['10:00 — 11:00', '12:00 — 13:00', '14:00 — 15:00', '16:00 — 17:00'],
};

app.get('/', async (req, res) => {
    let uahRate = 41.5;
    let eurRate = 45.0;
    let usdRate = 1.0;

    // 1. Курс USDT до UAH
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUAH');
        if (response.data?.price) {
            uahRate = Number(parseFloat(response.data.price).toFixed(2));
        }
    } catch (error) {
        console.error('Не вдалося отримати курс USDT/UAH:', error.message);
    }

    // 2. Курс EUR (НБУ повертає масив, поле називається rate)
    try {
        const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&json');
        if (Array.isArray(response.data) && response.data[0]?.rate) {
            const nbuEurUah = response.data[0].rate;
            eurRate = Number((uahRate / nbuEurUah).toFixed(2));
        }
    } catch (error) {
        console.error('Не вдалося отримати курс EUR:', error.message);
    }

    // 3. Курс USDT до USD
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUSD');
        if (response.data?.price) {
            usdRate = Number(parseFloat(response.data.price).toFixed(2));
        }
    } catch (error) {
        console.error('Не вдалося отримати курс USDT/USD:', error.message);
    }

    res.render('index', {
      ...data,
        // isP2P: false,
        rates: {
            UAH: uahRate,
            EUR: eurRate,
            USD: usdRate
        }
    });
});


app.post('/orders', (req, res) => {
    console.log('new order:', req.body);
    res.send('Замовлення прийнято (демо)');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
