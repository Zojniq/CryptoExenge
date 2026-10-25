import axios from 'axios';


export async function getRates() {
  let uahRate = 46.9;
  let eurRate = 50;
  let usdRate = 1.0;
  let source = 'live';

  try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUAH', { timeout: 5000 });
      if (response.data?.price) {
          uahRate = Number(parseFloat(response.data.price).toFixed(2));
      }
  } catch (error) {
      source = 'fallback';
      console.error('Не вдалося отримати курс USDT/UAH:', error.message);
  }

  // 2. Курс EUR (НБУ повертає масив, поле називається rate)
  try {
    const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&json', { timeout: 5000 });
      if (Array.isArray(response.data) && response.data[0]?.rate) {
          const nbuEurUah = response.data[0].rate;
          eurRate = Number((uahRate / nbuEurUah).toFixed(2));
      }
  } catch (error) {
      source = 'fallback';
      console.error('Не вдалося отримати курс EUR:', error.message);
  }

  // 3. Курс USDT до USD
  try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDTUSD', { timeout: 5000 });
      if (response.data?.price) {
          usdRate = Number(parseFloat(response.data.price).toFixed(2));
      }
  } catch (error) {
      source = 'fallback';
      console.error('Не вдалося отримати курс USDT/USD:', error.message);
  }

  return { rates: { UAH: uahRate, EUR: eurRate, USD: usdRate }, source};
}
