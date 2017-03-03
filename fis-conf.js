
/**
 * 全局变量
 */
fis
  .set('project.files', [ // 处理的文件类型
    '**.{js,json,proto,sh,ejs}',
    'package.json'
  ])
  .set('project.ignore', [ // 忽略的文件
    'node_modules/**',
    '**/beifen',

    '**/_*.*',
    '_output',

    'fis-conf.js',
    'sftp-config.json'
  ]);

var package = require('./package.json');
var mainVersion = package.version.replace(/\.\d+$/, '');

var media = fis.project.currentMedia();
var fisDeploys = {
  develop: {
    receiver: 'http://182.32.1.1:9010/receiver?token=ssaff',
    to: '/data/node_app/' + package.name + '/' + mainVersion,
  },
};

var fs = require('fs');
if (fs.existsSync('fis.deploy.jdists')) {
  var info = require('./fis.deploy.jdists');
  Object.keys(info).forEach(function(key) {
    fisDeploys[key] = info[key];
  })
}

var deployInfo = fisDeploys[media];
if (deployInfo) {

  fis.media(media).match('*', {
      parser: [
        fis.plugin('linenum'),
        fis.plugin('jdists', {
          trigger: ['release', deployInfo.alias || media].join()
        })
      ],
      deploy: fis.plugin('http-push2', {
        receiver: deployInfo.receiver,
        to: deployInfo.to,
        cacheDir: __dirname + '/.cache',
        notify: true
      })
    });

}
