/**
 * Reserves exactly as much vertical space as the fixed Navbar occupies.
 *
 * Navbar measures itself and writes --nav-h; the fallback covers the first
 * paint before that runs, and any page rendered without a Navbar.
 */
export default function NavSpacer() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0"
      style={{ height: "var(--nav-h, 8rem)" }}
    />
  );
}
