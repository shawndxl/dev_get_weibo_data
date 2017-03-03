var http = require('http');
var querystring = require('querystring');
var parse = require('url').parse;
var timeout = 3000;

/**
 * get请求
 * @param  {string} url 连接地址
 * @return {object}     错误返回 status 400
 */
exports.get = function(url) {
  return new Promise(function(resolve, reject) {
    var timer;
    var req = http.get(url, function(res) {
      res.setEncoding("utf-8");
      var body = '';
      res.on("data", function(chunk) {
        body += chunk;
      }).on("end", function() {
        if (timer) {
          clearTimeout(timer);
        }
        try {
          console.log('^linenum get url: %j body: %j', url, body);

          var data = JSON.parse(body);
          resolve(data);
        } catch (ex) {
          console.error("^linenum Got url: %j error: %j", url, ex.message);
          resolve({
            status: 400,
            desc: '服务器忙碌 #1'
          });
        }
      });
    });
    req.on('error', function(err) {
      if (timer) {
        clearTimeout(timer);
      }
      console.error("^linenum Got url: %j error: %j", url, err);

      resolve({
        status: 400,
        desc: '服务器忙碌 #2'
      });
    });

    timer = setTimeout(function() {
      timer = null;
      req.abort();
    }, timeout);
  });
};

/**
 * post请求
 *
 * @param  {string} url 连接地址
 * @param {object} postData 提交的数据
 * @return {Promise}
 */
exports.post = function(url, postData) {
  return new Promise(function(resolve, reject) {
    postData = querystring.stringify(postData);
    var parseData = parse(url);
    var options = {
      hostname: parseData.hostname,
      port: parseData.port,
      path: parseData.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    var timer;
    var req = http.request(options, function(res) {
      res.setEncoding("utf-8");
      var body = '';
      res.on("data", function(chunk) {
        body += chunk;
      }).on("end", function() {
        if (timer) {
          clearTimeout(timer);
        }
        try {
          console.log('^linenum post url: %j body: %j', url, body);

          var data = JSON.parse(body);
          resolve(data);
        } catch (ex) {
          console.error("^linenum Got url: %j error: %j", url, ex.message);
          resolve({
            status: 400,
            desc: '服务器忙碌 #1'
          });
        }
      });
    });

    req.on('error', function(err) {
      if (timer) {
        clearTimeout(timer);
      }
      console.error("^linenum Got url:%j error: %j", url, err);

      resolve({
        status: 400,
        desc: '服务器忙碌 #2'
      });
    });
    req.write(postData);
    req.end();

    timer = setTimeout(function() {
      timer = null;
      req.abort();
    }, timeout);
  });
};
