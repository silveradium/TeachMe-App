import type { SVGProps } from "react";

export default function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M1.8 14C1.305 14 0.8814 13.8288 0.5292 13.4864C0.1764 13.1434 0 12.7312 0 12.25V1.75C0 1.26875 0.1764 0.856917 0.5292 0.5145C0.8814 0.1715 1.305 0 1.8 0H16.2C16.695 0 17.1189 0.1715 17.4717 0.5145C17.8239 0.856917 18 1.26875 18 1.75V12.25C18 12.7312 17.8239 13.1434 17.4717 13.4864C17.1189 13.8288 16.695 14 16.2 14H1.8ZM9 7.875L1.8 3.5V12.25H16.2V3.5L9 7.875ZM9 6.125L16.2 1.75H1.8L9 6.125ZM1.8 3.5V1.75V12.25V3.5Z" />
    </svg>
  );
}
