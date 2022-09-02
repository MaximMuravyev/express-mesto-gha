const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    default: 'Жак-Ив Кусто',
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    required: true,
    validate: {
      validator(url) {
        return /https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?/gim.test(url);
      },
      message: 'Неккоректный url',
    },
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
