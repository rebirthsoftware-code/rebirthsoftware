/**
 * Dev "rebirth." filigranı.
 * Metin değil dekoratif çizim olduğu için SVG olarak basılır: ekran
 * okuyucular atlar, seçilemez ve renk kontrastı kuralına takılmaz.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 150"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`w-full select-none ${className}`}
    >
      <text
        x="380"
        y="118"
        textAnchor="middle"
        fontSize="150"
        fontWeight="700"
        letterSpacing="-7"
        style={{ fontFamily: "inherit" }}
      >
        <tspan fill="var(--color-ink)" fillOpacity="0.07">
          rebirth
        </tspan>
        <tspan fill="var(--color-flame)" fillOpacity="0.22">
          .
        </tspan>
      </text>
    </svg>
  );
}
