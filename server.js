import express from 'express';
import axios from 'axios';
import { getBranches, getCryptos, getSlots } from './db/catalog.js';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const data = {
    title: 'ВЕКТОР — криптообмінник',
    methods: [
        { id: 'cash', title: 'Готівка в обміннику', text: 'Резервуй суму на обрану дату й забери особисто' },
  ]
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

  const branches = await getBranches();
  const cryptos = await getCryptos();
  const slots = await getSlots();

    res.render('index', {
      ...data,
      branches: branches,
      cryptos: cryptos,
      slots: slots,
        rates: {
            UAH: uahRate,
            EUR: eurRate,
            USD: usdRate
        }
    });
});

app.post('/orders', (req, res) => {
  console.log('new order:', req.body);
  res.redirect('/order');
});

app.get('/order', (req, res) => {
  res.render('order');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
