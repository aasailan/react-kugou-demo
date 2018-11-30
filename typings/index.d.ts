declare module "*.scss"

interface Window {
  // 声明合并 redux开发工具
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: string
}

// declare module "React" {
//   namespace React {
//     interface Attributes {
//       styleName?: string;
      // aa?: string;
//     }
//   }
// }

// declare namespace React {
//   interface Attributes {
//     styleName?: string;
//     aa?: string;
//   }
// }
