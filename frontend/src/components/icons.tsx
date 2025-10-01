import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; title?: string };

const base = (size?: number) => ({
  width: size ?? 24,
  height: size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

export const ViewIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "View"}</title>
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ViewOffIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "View Off"}</title>
    <path
      d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A10.94 10.94 0 0112 5c7 0 11 7 11 7a20.83 20.83 0 01-5.06 5.94M6.61 6.61A20.82 20.82 0 001 12s4 7 11 7a10.94 10.94 0 004.91-1.12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AddIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "Add"}</title>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronDownIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "Chevron Down"}</title>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronRightIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "Chevron Right"}</title>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "Chevron Left"}</title>
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DeleteIcon = ({ size, title, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <title>{title ?? "Delete"}</title>
    <path
      d="M3 6h18M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6M10 10v8M14 10v8M9 6l1-2h4l1 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
