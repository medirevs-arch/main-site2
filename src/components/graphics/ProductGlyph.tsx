/**
 * One glyph per product. All three are built from the same optical geometry —
 * a 120px field, 1px strokes, concentric structure — so they read as a set.
 */

type Props = { product: "doctorevs" | "ehr" | "data-ai"; className?: string };

export default function ProductGlyph({ product, className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />

      {product === "doctorevs" && (
        <g stroke="currentColor" strokeWidth="1">
          {/* Two fields of view, overlapping: the consultation */}
          <circle cx="46" cy="60" r="26" opacity="0.75" />
          <circle cx="74" cy="60" r="26" opacity="0.75" />
          <circle cx="46" cy="60" r="3.5" fill="currentColor" stroke="none" />
          <circle cx="74" cy="60" r="3.5" fill="currentColor" stroke="none" />
          <line x1="46" y1="60" x2="74" y2="60" opacity="0.5" />
        </g>
      )}

      {product === "ehr" && (
        <g stroke="currentColor" strokeWidth="1">
          {/* A record, structured: ruled lines inside the field */}
          <circle cx="60" cy="60" r="34" opacity="0.4" />
          <line x1="38" y1="48" x2="82" y2="48" opacity="0.8" />
          <line x1="38" y1="60" x2="72" y2="60" opacity="0.6" />
          <line x1="38" y1="72" x2="78" y2="72" opacity="0.6" />
          <circle cx="88" cy="48" r="3" fill="currentColor" stroke="none" opacity="0.9" />
        </g>
      )}

      {product === "data-ai" && (
        <g stroke="currentColor" strokeWidth="1">
          {/* A signal, resolving: voice and conversation */}
          <circle cx="60" cy="60" r="34" opacity="0.4" />
          <line x1="42" y1="52" x2="42" y2="68" opacity="0.55" />
          <line x1="51" y1="45" x2="51" y2="75" opacity="0.75" />
          <line x1="60" y1="38" x2="60" y2="82" opacity="0.95" />
          <line x1="69" y1="47" x2="69" y2="73" opacity="0.75" />
          <line x1="78" y1="54" x2="78" y2="66" opacity="0.55" />
        </g>
      )}
    </svg>
  );
}
