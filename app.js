const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(helmet());

app.use(bodyParser.json());
app.use('/', authRouter);

app.use(cookieParser());
app.use(auth);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req, res, next) => next(new ErrorNotFound('Неправильный маршрут')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
