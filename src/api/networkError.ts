/*
 * @Author: qiao 
 * @Date: 2018-12-04 14:54:19 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-06 20:25:57
 * 网络错误类
 */

/**
 * @description NOTE: 自定义error，用来改变自定义error的构造函数，
 *  确保 error instanceof NetworkError的判断是正确的 babel中可能存在同样的问题
 *  https://github.com/Microsoft/TypeScript/issues/13965
 * @export
 * @class MyError
 * @extends {Error}
 */
export class MyError extends Error {
  __proto__: Error;
  constructor(message?: string) {
      const trueProto = new.target.prototype;
      super(message);

      // Alternatively use Object.setPrototypeOf if you have an ES6 environment.
      this.__proto__ = trueProto;
  }
}

export class NetworkError extends MyError {
  constructor(msg: string) {
    super(msg);
  }
}
