import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const SvgComponent = (props) => {
  const size = props?.size ?? 10; // Default size
  const strokeWidth = size * 0.05; // Dynamically scale stroke width

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 10 10" // ✅ Fixes scaling
      fill="none"
      {...props}
    >
      <G
        stroke={props?.stroke ?? "#6B7280"}
        strokeWidth={strokeWidth} // ✅ Stroke width scales with size
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#a)"
      >
        <Path d="M5.17 5.424a2.083 2.083 0 0 1 3.997.826c0 1.61-1.667 2.917-3.75 2.917-1.7 0-3.397-.342-4.322-1.026a.677.677 0 0 1-.258-.568c.046-2.272.258-6.74 3.33-6.74a1.25 1.25 0 0 1 1.25 1.25.833.833 0 0 1-.834.834c-.46 0-.683-.185-.833-.417" />
        <Path d="M6.25 5.833a2.083 2.083 0 0 0-3.16.834" />
        <Path d="M4.152 2.844c-.81.48-.194 2.573-.819 3.406" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h10v10H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export { SvgComponent as ExerciseCount };
