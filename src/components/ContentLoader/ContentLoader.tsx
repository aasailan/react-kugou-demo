/*
 * @Author: qiao 
 * @Date: 2018-12-03 21:34:39 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-12-03 22:49:32
 * 自定义数据加载界面
 */
import React from 'react';
import ContentLoader from 'react-content-loader';

interface IProps {
  height?: number;
  [key: string]: any;
}

export function CustomLoader({ height = 400, ...props }: IProps) {
  // TODO: 如何迅速创建一个数组
  const length = Math.floor(height / 30);
  const arr = new Array();
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return (
    <ContentLoader 
      rtl={true}
      height={height}
      width={401}
      speed={1}
      primaryColor="#f3f3f3"
      secondaryColor="#c0c0c0"
      {...props}
	  >
    {
      arr.map((item) => (
        <React.Fragment key={item}>
          <circle cx="30" cy={20 + item * 30} r="8" /> 
          <rect x="45" y={15 + item * 30} rx="5" ry="5" width="320" height="10" />
        </React.Fragment>
      ))
    }
      
	  </ContentLoader>
  );
}
