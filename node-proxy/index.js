/*
 * @Author: qiao 
 * @Date: 2018-12-21 10:02:31 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-21 16:46:59
 * 代理转发
 */

const express = require('express');
// let request = require('superagent')
const proxy = require('http-proxy-middleware');
const path = require('path');

const proxyOptions = {
  '/proxy': {
    target: 'http://m.kugou.com',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': ''
    }
  },
  '/aproxy': {
    target: 'http://mobilecdn.kugou.com',
    changeOrigin: true,
    pathRewrite: {
      '^/aproxy': ''
    }
  },
  '/bproxy': {
    target: 'http://www.kugou.com',
    changeOrigin: true,
    pathRewrite: {
      '^/bproxy': ''
    }
  }
};


const app = express();

// static file
app.use(express.static(path.resolve('./build')));

/**
 * CORS support.
 */
// app.all('*', function (req, res, next) {
//   if (!req.get('Origin')) {
//     return next();
//   }
//   // use "*" here to accept any origin
//   res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
//   res.set('Access-Control-Allow-Methods', 'GET')
//   res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
//   res.set('Access-Control-Allow-Credentials', true);
//   if (req.method === 'OPTIONS') {
//     return res.send(200);
//   }
//   next()
// })

// 手动编写代理
// app.get('/proxy', (req, res) => {
//   let sreq = request.get('http://m.kugou.com' + req.originalUrl)
//   sreq.pipe(res)
//     sreq.on('end', function (error, res) {
//       // console.log(`>>> fetch ${requestItem} succeed`)
//     })
// });

Object.keys(proxyOptions).forEach(key => {
  app.use(key, proxy(proxyOptions[key]));
});

// 404
app.use((req, res) => {
  res.sendfile('./build/index.html');
});

app.listen(3001);