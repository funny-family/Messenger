const { createAuthTokens } = require('../functions/create-auth-tokens');
const { setAuthCookies } = require('../functions/set-auth-сookies');

module.exports = async function (ctx) {
  const tokens = createAuthTokens(ctx.state.user);
  await setAuthCookies(ctx, tokens);

  ctx.type = 'json';
  ctx.body = tokens;
};
