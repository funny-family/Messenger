const User = require('@/infrastructure/database/models/User');

module.exports = async function (ctx) {
  const userData = ctx.request.body;
  const newUser = new User(userData);

  await newUser.save();

  ctx.type = 'json';
  ctx.body = newUser;
};
