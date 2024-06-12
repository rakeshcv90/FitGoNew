import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      stroke="#717171"
      strokeWidth={0.3}
      d="m13.593 6.227-.043.039-2.817 2.551-.065.059.019.085.844 3.799c.038.17.027.35-.032.514a.883.883 0 0 1-.298.408.822.822 0 0 1-.933.042l-3.192-2.01-.08-.05-.08.05-3.185 2.01a.821.821 0 0 1-.934-.042.884.884 0 0 1-.298-.408.924.924 0 0 1-.031-.514l.843-3.795.018-.085-.064-.059L.447 6.266a.893.893 0 0 1-.265-.434.925.925 0 0 1 .01-.516l-.143-.044.143.044a.888.888 0 0 1 .282-.421.83.83 0 0 1 .455-.187l3.714-.334.091-.008.034-.085L6.218.692a.876.876 0 0 1 .313-.395.82.82 0 0 1 .935 0 .876.876 0 0 1 .313.395l1.454 3.589.034.085.091.008 3.713.334c.166.014.324.079.455.187s.23.254.282.421a.925.925 0 0 1 .01.516.897.897 0 0 1-.225.395Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0}
        x2={13.5}
        y1={8}
        y2={8}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#ECC440" />
        <Stop offset={0.425} stopColor="#FFFA8A" />
        <Stop offset={0.67} stopColor="#DDAC17" />
        <Stop offset={1} stopColor="#FFFF95" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export { SvgComponent as StarColor }
