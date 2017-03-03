
var http = require('http');
var fs = require('fs');

//var querystring = require('querystring');
//var parse = require('url').parse;
var timeout = 3000;

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (reply) => {
      var body = '';
      reply.on('data', (data) => {
        body += data;
      });
      reply.on('end', () => {
        resolve(body)
      });
      reply.on('error', (err) => {
        reject(err);
      })
    })
  })
}

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};


var urlArr = [
  'http://m.weibo.cn/api/comments/show?id=4067439203757820&page=', // 尊敬的各位派友
  'http://m.weibo.cn/api/comments/show?id=4067386095232960&page=', // 有一种习惯越夜越精神
]

var urlIndex = 0; // 0 或者 1


var fileName = new Date().Format("yyyyMMdd_hh_mm_") + urlIndex + '.txt';
// console.log(fileName);

var initIndex = 1; // 停在721 共3100左右
var reTryNum = 4;

fs.appendFileSync(fileName, ('begin at index: ' + initIndex +'\n'))
getData();
function getData() {
  var data = httpGet(urlArr[urlIndex] + initIndex).then(function(reply) {
    console.log('curIndex:', initIndex)
    var arr = [];
    try {
      reply = JSON.parse(reply)
      if (reply.ok != 1) {
        if (reTryNum) {
            reTryNum--;
            console.log(reply && reply.msg)
            getData();
        } else {
          console.log('end at index: ', initIndex);
          fs.appendFileSync(fileName, ('\n end at index: ' + initIndex))
          return;
        }
      }
      initIndex++;
      reply.data.forEach(function(item) {
        //console.log(item.text)
        //return;
        var a = item.text.match(/\d{5,}/g);
        //console.log(a)
        if (a) {
          arr = arr.concat(a)
        }
      })
      console.log(arr)

      fs.appendFileSync(fileName, arr);
      getData();
    } catch (err) {
      console.log('err:#1: ', err);
      fs.appendFileSync(fileName, ('\n end at index: ' + initIndex))
    }

  });
}

