import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { AppColor } from '../../Color';
export const ArrowRight =({fillColor , ...props})=> (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={13}
    fill="none"
    {...props}>
    <Path
      fill={fillColor??AppColor.BLACK}
      d="M1 5.5H0v2h1v-2Zm0 2h29.33v-2H1v2ZM24.538 0c0 4.137 3.335 7.5 7.462 7.5v-2c-3.01 0-5.462-2.457-5.462-5.5h-2ZM32 5.5c-4.127 0-7.462 3.363-7.462 7.5h2c0-3.043 2.451-5.5 5.462-5.5v-2Z"
    />
  </Svg>
);
export const ArrowLeft = ({fillColor,...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={15}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
       fill={fillColor??AppColor.BLACK}
        d="m32.01 8.338 1-.01-.022-2-1 .01.022 2Zm-.022-2L2.66 6.655l.022 2 29.329-.316-.022-2ZM8.532 14.093C8.487 9.955 5.116 6.628.99 6.672l.022 2c3.01-.032 5.487 2.398 5.52 5.441l2-.021Zm-7.52-5.42c4.126-.044 7.425-3.443 7.38-7.58l-2 .022C6.425 4.157 4.001 6.64.99 6.672l.022 2Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path  fill={fillColor??AppColor.BLACK} d="m.96 1.097 32-.194.08 13-32 .194z" />
      </ClipPath>
    </Defs>
  </Svg>
)