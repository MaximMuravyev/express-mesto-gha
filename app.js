const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use('/', authRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', errorRoutes);
app.use('/', userRouter, auth);
app.use('/', cardRouter, auth);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`listening port ${PORT}`);
  }
});
