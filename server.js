import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', { title: 'ВЕКТОР — криптообмінник' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});