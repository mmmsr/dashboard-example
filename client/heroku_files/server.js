var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var sslRedirect = require('heroku-ssl-redirect');
var history = require('connect-history-api-fallback');

app = express();
app.use(serveStatic(__dirname));

// HHTPSへ強制リダイレクトする(Herokuでのみ有効)
app.use(sslRedirect());

// URLの#の除去
app.use(history({
  verbose: true
}))
app.use(express.static('.'))

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);
