import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={10}
    fill="none"
    {...props}
  >
    <Path
      stroke="#6B7280"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.8}
      d="M2.542 6.042A1.042 1.042 0 0 0 3.584 5c0-.575-.209-.833-.417-1.25-.447-.893-.093-1.69.833-2.5.208 1.042.833 2.042 1.667 2.708.833.667 1.25 1.459 1.25 2.292a2.917 2.917 0 1 1-5.833 0c0-.48.18-.956.416-1.25a1.042 1.042 0 0 0 1.042 1.042Z"
    />
  </Svg>
)
export { SvgComponent as ExerciseKcal }
