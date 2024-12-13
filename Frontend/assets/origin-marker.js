import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={52}
      height={98}
      viewBox="0 0 52 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M32 94.5c0 1.933-2.686 3.5-6 3.5s-6-1.567-6-3.5 2.686-3.5 6-3.5 6 1.567 6 3.5z"
        fill="#000"
      />
      <Path
        d="M24 49a1 1 0 011-1h2a1 1 0 011 1v44a1 1 0 01-1 1h-2a1 1 0 01-1-1V49z"
        fill="#3D3D3D"
      />
      <Path
        d="M52 26c0 14.36-11.64 26-26 26S0 40.36 0 26 11.64 0 26 0s26 11.64 26 26z"
        fill="url(#paint0_linear_3669_755)"
      />
      <Path d="M35 26a9 9 0 11-18 0 9 9 0 0118 0z" fill="#fff" />
      <Defs>
        <LinearGradient
          id="paint0_linear_3669_755"
          x1={26}
          y1={0}
          x2={26}
          y2={98}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3AC129" />
          <Stop offset={1} stopColor="#23AF1B" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
