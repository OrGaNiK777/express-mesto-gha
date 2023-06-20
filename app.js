const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const host = 'localhost';

const { PORT } = process.env;

const app = express();

app.use(express.static('build'));

mongoose
  .connect('mongodb://localhost:27017/MestoDB', {
    useNewUrlParser: true,
    family: 4,
  })
  .then(() => {
    console.log('Connected to DB');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648f4eceac33ebb800e0acee', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(routes);

app.listen(PORT, host, () => {
  console.log(`Cервер запущен на http://${host}:${PORT}/`);
});
