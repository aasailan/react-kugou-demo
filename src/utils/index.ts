/*
 * @Author: qiao 
 * @Date: 2018-11-26 17:26:09 
 * @Last Modified by:   qiao 
 * @Last Modified time: 2018-11-26 17:26:09 
 */

export function createReducer<IState>(initialState: IState, handlers) {
  return (state: IState = initialState, action) => {
    const { type } = action;
    if (handlers.hasOwnProperty(type)) {
      return handlers[type](state, action);
    }
    return state;
  }
}