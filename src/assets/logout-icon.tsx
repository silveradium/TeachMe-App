import type { SVGProps } from "react";

function Line(props: SVGProps<SVGLineElement>) {
  return (
    <line
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2px"
      {...props}
    />
  );
}

export default function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <title />
      <g id="logout">
        <Line x1="15.92" x2="28.92" y1="16" y2="16" />
        <path d="M23.93,25v3h-16V4h16V7h2V3a1,1,0,0,0-1-1h-18a1,1,0,0,0-1,1V29a1,1,0,0,0,1,1h18a1,1,0,0,0,1-1V25Z" />
        <Line x1="28.92" x2="24.92" y1="16" y2="20" />
        <Line x1="28.92" x2="24.92" y1="16" y2="12" />
        <Line x1="24.92" x2="24.92" y1="8.09" y2="6.09" />
        <Line x1="24.92" x2="24.92" y1="26" y2="24" />
      </g>
    </svg>
  );
}
