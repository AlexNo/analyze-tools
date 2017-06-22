let path = require('path');
let defer = require('config/defer').deferConfig;

module.exports = {
  app: {
    name: 'GGRC Tools'
  },
  server: {
    port: 3000
  },
  handlers: [
    'static',
    'logger',
    'templates',
    'errors',
    'bodyParser',
    'tools',
    'api'
  ],
  template: {
    // template.root uses config.root
    root: defer(function (cfg) {
      return path.join(cfg.root, 'handlers');
    }),
    basedir: path.join(process.cwd(), 'templates')
  },
  root: process.cwd(),

  github: {
    baseApiURL: 'https://api.github.com'
  }
};