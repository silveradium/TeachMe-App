import type { SVGProps } from "react";

export default function ChaptersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="30"
      height="35"
      viewBox="0 0 30 35"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M4.28571 0C3.98571 0 3.72857 0.0428571 3.47143 0.128571C1.8 0.471429 0.471429 1.8 0.128571 3.47143C0 3.72857 0 3.98571 0 4.28571V27.8571C0 31.4143 2.87143 34.2857 6.42857 34.2857H30V30H6.42857C5.22857 30 4.28571 29.0571 4.28571 27.8571C4.28571 26.6571 5.22857 25.7143 6.42857 25.7143H30V2.14286C30 0.942857 29.0571 0 27.8571 0H25.7143V12.8571L21.4286 8.57143L17.1429 12.8571V0H4.28571Z" />
    </svg>
  );
}
