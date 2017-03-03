/* 测试成功无限制版，直接复制到console中使用，原理就是带上cookie以正常用户的身份去请求，缺点是输出也是在console中，最终数据量太多计算会变慢，console表示压力很大 */
// 需要最新谷歌浏览器 才支持fetch方法
// 登陆微博手机页面，在微博手机页的控制台，输入这个代码 才可以获取cookie 才能不被限制

var re = [];
var index = 0;
get();

var weiboContentId = '4081146931187545'; // 某条微博的ID

function get() {
  if(index > 3) return console.log(re.join(' ')); // 限制数量，每条返回带10条评论数据，用户的评论数 除以10 就是你需要限制的数，也可以分几次得出几个批次的数据自己再排重合并也可以
  index++;
  console.log(index);
  fetch('http://m.weibo.cn/api/comments/show?id=' + weiboContentId + '&page=' + index, {
    method: "GET",
    redential: "include",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding" : "gzip, deflate, sdch",
      "Accept-Language": "zh-CN,zh;q=0.8",
      "Connection": "keep-alive",
      "Cookie": document.cookie,
      "Host": "m.weibo.cn",
      "Referer": "http://m.weibo.cn/status/Esh1flXkA",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest"
    },
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    if(data.data.length) {
      data.data.forEach(function(item) {
        var arr = item.text.match(/\d{5,}/g);
        (arr || []).forEach(function(num){
          if(re.indexOf(num) == -1) {
            re.push(num);
          }
        });
      });
      setTimeout(function() {
        get();
      }, index % 100 ? 0 : 2000);
    } else {
      console.log(data);
      console.log(re.join(' '));
    }

  }).catch(function(e) {
    get();
    console.log(e);
  });
}
