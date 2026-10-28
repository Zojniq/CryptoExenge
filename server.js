import express from 'express';
import { createOrder } from './db/orders.js';
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

app.post('/orders', async (req, res) => {
  const fiatAmount = Number(String(req.body.amount).replace(/\D/g, ''));
  const branchId = Number(req.body.branch);
  const cryptoId = Number(req.body.crypto);
  const slotId = Number(req.body.time);
  const currency = String(req.body.currency);
  const visitDate = String(req.body.date);

  if (!(fiatAmount > 0)) {
    return res.status(400).send("Невірна сума.");
  }

  if (!Number.isInteger(branchId) || branchId <= 0) {
    return res.status(400).send("Невірне відділення.");
  }

  if (!(currency === "UAH" || currency === "USD" || currency === "EUR")) {
    return res.status(400).send("Невідома валюта.");
  }

  if (!Number.isInteger(cryptoId) || cryptoId <= 0) {
    return res.status(400).send("Невідомий коін.");
  }

  if (!Number.isInteger(slotId) || slotId <= 0) {
    return res.status(400).send("Невідомий час.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
    return res.status(400).send("Невідомий формат дати.");
  }

  const { rates, source } = await getRates();

  if (source === "fallback") {
    return res.status(503).send("Сервіс тимчасово недоступний");
  }

  const rate = rates[currency];
  const cryptoAmount = Number((fiatAmount / rate).toFixed(6));

  console.log("Усе валідно.", {
    fiatAmount,
    branchId,
    cryptoId,
    slotId,
    currency,
    visitDate
  });

  console.log(rate, cryptoAmount);

  const code = await createOrder({
    branch_id: branchId,
    crypto_id: cryptoId,
    slot_id: slotId,
    visit_date: visitDate,
    fiat_amount: fiatAmount,
    fiat_currency: currency,
    rate: rate,
    crypto_amount: cryptoAmount
  });

  res.redirect(`/orders/${code}`);
});

app.get('/order', (req, res) => {
  res.render('order');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
