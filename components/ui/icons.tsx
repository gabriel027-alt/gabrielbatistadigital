import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { size?: number };
export function Arrow({ size = 18, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
export function Chevron({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
export function Sun({ size = 18, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </svg>
  );
}
export function Moon({ size = 18, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 14.2A8.5 8.5 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z" />
    </svg>
  );
}
export function WhatsAppIcon({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z" />
      <path d="m8 7.5 1.4-.3 1 2-1 1c.8 1.7 1.7 2.5 3.3 3.2l1-1 2 1-.3 1.4c-.4 2.1-3.6 1-5.7-1.1S5.9 8 8 7.5Z" />
    </svg>
  );
}
export function Asterisk({ size = 80, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="46"
          y="4"
          width="8"
          height="47"
          rx="1"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </svg>
  );
}
export function ArrowDown({ size = 18, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 4v16m-7-7 7 7 7-7" />
    </svg>
  );
}
export function ArrowLeft({ size = 18, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 12H4m7-7-7 7 7 7" />
    </svg>
  );
}
