module.exports = {
  "plugins": {
    "postcss-import": {}, // 必须放在插件列表的第一个位置
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    // 这个插件通过移除注释、空白、重复规则、过时的浏览器前缀以及做出其他的优化来压缩CSS文件来确保尽可能的小
    "cssnano": {
      safe: true
    },
    "postcss-write-svg": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334 也可以不配置
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [/.*mu-.*/, /.*ig-.*/, /.*--ig/], // 过滤掉mu组件库的类，不转换为vw单位
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false // 允许在媒体查询中转换`px
    },
  }
}