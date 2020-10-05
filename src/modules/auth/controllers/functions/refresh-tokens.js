const UserList = require('@/db-requests/user');
const BlackTokenList = require('@/db-requests/black-token');

const { createAuthTokens } = require('./create-auth-tokens');
const { setAuthCookies } = require('./set-auth-сookies');
const { clearAuthCookies } = require('./clear-auth-cookies');
const { decodeToken } = require('./decode-token');

exports.refreshTokens = async ctx => {
  const access_token = ctx.headers['x-access-token'] ||
                      ctx.query.access_token ||
                      ctx.cookies.get('x-access-token') ||
                      ctx.body && ctx.body.access_token;

  const refresh_token = ctx.headers['x-refresh-token'] ||
                      ctx.query.refresh_token ||
                      ctx.cookies.get('x-refresh-token') ||
                      ctx.body && ctx.body.refresh_token;

  if (!access_token || !refresh_token) return ctx.throw(401, 'No token found!');

  try {
    const decodedRefreshToken = decodeToken(refresh_token);
    const id = decodedRefreshToken._id;
    const userFromDecodedToken = await UserList.findId(id);
    const newTokens = createAuthTokens(userFromDecodedToken);

    if (!access_token || !refresh_token) return ctx.throw(401, 'No token!');
    if (!userFromDecodedToken) return ctx.throw(500, 'Invalid token!');

    setAuthCookies(ctx, newTokens);

    await Promise.all([
      BlackTokenList.addTokenAndSave(access_token),
      BlackTokenList.addTokenAndSave(refresh_token)
    ]);
  } catch (err) {
    clearAuthCookies(ctx);
    return ctx.throw(401, 'Refresh token validation error!');
  }
};
