/**
 * The Medirevs "m" mark, drawn inline.
 *
 * This is the existing Medirevs app/favicon mark rebuilt as vector geometry so
 * it stays crisp at 18px inside the navigation pill, with the brand's own
 * teal-to-blue gradient. The wordmark is still used everywhere it has room.
 */
export default function MedirevsMark({
  size = 18,
  className = "",
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 20"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id="medirevs-mark" x1="0" y1="0" x2="26" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#289d90" />
          <stop offset="1" stopColor="#55b0df" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#medirevs-mark)"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17.6 V5.9" />
        <path d="M3 10.1 C3 7.4 4.9 5.9 7.4 5.9 C9.9 5.9 11.6 7.5 11.6 10.3 V17.6" />
        <path d="M11.6 10.1 C11.6 7.4 13.5 5.9 16 5.9 C18.5 5.9 20.2 7.5 20.2 10.3 V17.6" />
      </g>
    </svg>
  );
}
