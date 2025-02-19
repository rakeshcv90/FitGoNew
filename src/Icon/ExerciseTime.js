import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#6B7280"
      fillRule="evenodd"
      d="M7.5.375A.375.375 0 0 0 7.123 0h-2.25a.375.375 0 0 0 0 .75h.375v.802A5.25 5.25 0 0 0 6 12a5.25 5.25 0 0 0 .75-10.447V.75h.375A.375.375 0 0 0 7.5.375ZM6 2.25a4.5 4.5 0 1 1-.001 9 4.5 4.5 0 0 1 0-9Zm0 1.575a.375.375 0 0 0-.376.375v2.55A.375.375 0 0 0 6 7.125h2.625a.375.375 0 0 0 0-.75h-2.25V4.2A.375.375 0 0 0 6 3.825Z"
      clipRule="evenodd"
    />
  </Svg>
)
export { SvgComponent as ExerciseTime }
