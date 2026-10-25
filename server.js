import express from 'express';
import { getBranches, getCryptos, getSlots } from './db/catalog.js';
import { getRates } from './services/rates.js';

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
  const { rates, source } = await getRates();
  const branches = await getBranches();
  const cryptos = await getCryptos();
  const slots = await getSlots();

    res.render('index', {
      ...data,
      branches: branches,
      cryptos: cryptos,
      slots: slots,
      rates: rates,
      source: source
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
