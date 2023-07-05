const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(avatar) {
        return /^(http:|https:)\/\/w*\w/.test(avatar);
      },
      message: 'Ссылка некорректна',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Email некорректный',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator(password) {
        return validator.isStrongPassword(password);
      },
      message: 'Длина должна быть не менее 8 символов',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
