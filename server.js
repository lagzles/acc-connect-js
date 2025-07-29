const express = require('express');
const session = require('cookie-session');
const { PORT, SERVER_SESSION_SECRET } = require('./config.js');

let app = express();
app.use(express.static('src/wwwroot'));
app.use(express.static('src/public'));
app.use(session({ secret: SERVER_SESSION_SECRET, maxAge: 24 * 60 * 60 * 1000 }));
app.use(require('./src/routes/auth.js'));
app.use(require('./src/routes/hubs.js'));
console.log(`http://localhost:8080`)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
