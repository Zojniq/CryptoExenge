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
        { id: 'p2p', title: 'P2P обмін', text: 'Обмін без фізичного візиту — онлайн між сторонами' },
    ],
    cryptos: [
        { code: 'USDT', network: 'TRON · TRC-20' },
        { code: 'USDC', network: 'Polygon' },
    ],
    branches: [
        { id: 'kyiv-zoloti-vorota', name: 'Київ, м. Золоті Ворота' },
        { id: 'kyiv-maidan', name: 'Київ, м. Майдан Незалежності' },
    ],
    slots: ['10:00 — 11:00', '12:00 — 13:00', '14:00 — 15:00', '16:00 — 17:00'],
};

app.get('/', async (req, res) => {
    let uahRate = 41.25; // Резервний курс на випадок збою мережі

    try {
        // Отримуємо актуальний курс USDT до UAH напряму з Binance
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUAH');
        uahRate = parseFloat(parseFloat(response.data.price).toFixed(2));
    } catch (error) {
        console.error('Не вдалося отримати курс з Binance:', error.message);
    }

    // Передаємо динамічний курс у rates
    res.render('index', {
        ...data,
        rates: { UAH: uahRate }
    });
});

app.post('/orders', (req, res) => {
    console.log('Нове замовлення:', req.body);
    res.send('Замовлення прийнято (демо)');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});