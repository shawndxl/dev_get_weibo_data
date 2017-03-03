var http = require('http');
var fs = require('fs');

var proxys = String(fs.readFileSync('proxys.txt')).trim().split(/[\s,;]+/);
console.log(proxys);

var url = require('url');
var HttpProxyAgent = require('http-proxy-agent');
// @
// HTTP/HTTPS proxy to connect to
var proxy = proxys[0];
console.log('using proxy server %j', proxy);

// HTTP endpoint for the proxy to connect to
var endpoint = 'http://m.weibo.cn/api/comments/show?id=4067439203757820&page=1';
var opts = url.parse(endpoint);

// create an instance of the `HttpProxyAgent` class with the proxy server information
var agent = new HttpProxyAgent('http://' + proxy);
opts.agent = agent;

http.get(opts, function (res) {
  console.log('"response" event!', res.headers);
  res.pipe(process.stdout);
});



