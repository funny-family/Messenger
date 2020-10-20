const KoaRouter = require('koa-router');

// const fs = require('fs');
// const path = require('path');

function createRoutes(routes, prefix = '') {
  // const routePathRegex = /^\/(.*)\/(?:([^\/]+?))\/?$/;
  const routePathRegex = /^\/(.*)(?:([^\/]+?))\/?$/;

  const newRoute = new KoaRouter();

  const checkMethodName = (methodName) => {
    return ['get', 'post', 'put', 'del'].indexOf(methodName) !== -1;
  };

  for (const { method = '', path = '', middlewares = [], callback } of routes) {
    if (!method) {
      throw new Error('Method of route is required!');
    } else if (typeof method !== 'string') {
      throw new TypeError(`Route method should be type of string instead of "${typeof method}"!`);
    } else if (checkMethodName(method) === false) {
      throw new SyntaxError(`Invalid method name ${method}!`);
    }

    if (!path) {
      throw new Error('Path of route is required!');
    } else if (typeof path !== 'string') {
      throw new TypeError(`Path should be string type instead of ${typeof path}!`);
    }

    if (!callback) {
      throw new Error('Callback of route is required!');
    }

    newRoute[method](
      path,
      ...middlewares,
      callback
    );
  }

  if (typeof prefix !== 'string') {
    throw new TypeError(`Prefix should be string type instead of ${typeof prefix}!`);
  }

  if (routePathRegex.test(prefix) === false) {
    throw new SyntaxError(`Prefix "${prefix}" dose not match pattern!`);
  }

  newRoute.prefix(prefix);

  return newRoute;
}

function combineRoutes({ appInstance, routes = [], middlewares = [] }) {
  if (!appInstance) {
    throw new Error('Application instance is required!');
  }

  if (routes.length < 0) {
    throw new Error('Combiner requires at least one route!');
  }

  if (middlewares.length > 0) {
    appInstance.use(...middlewares);
  }

  routes.map((route) => {
    return appInstance.use(route.routes());
  });
}

function connectRouters() {
  // require('./modules/user')(app);

  // const dirPath = path.join(__dirname, folderPath);
  // require(dirPath)(appInstance);

  // fs.readdir('', (err, files) => {
  //   if (err) {
  //     console.log('Readdir error!');
  //     throw err;
  //   }

  //   files.forEach((folderName) => {
  //     require(path.join(__dirname, folderName))(appInstance);
  //   });
  // });
}

exports.createRoutes = createRoutes;
exports.combineRoutes = combineRoutes;
exports.connectRouters = connectRouters;
