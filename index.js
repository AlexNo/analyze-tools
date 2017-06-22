const server = require('./server');
const config = require('config');

server.listen(config.server.port, () => {
    console.log(`Server ${config.app.name} started on ${config.server.port} port`)
});
