const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '62dd54d4aab2dd43f49f6b3b',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена!' });
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`listening port ${PORT}`);
  }
});
