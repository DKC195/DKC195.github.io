/**
 * Apple's official "Download on the App Store" badge, used unmodified per the
 * App Store marketing guidelines (developer.apple.com/app-store/marketing/guidelines/).
 * Apple prefers the black badge everywhere; its gray border keeps it legible
 * on dark backgrounds, so there is no white variant.
 */
export function AppStoreBadge({ href, appName }: { href: string; appName: string }) {
  return (
    <a
      href={href}
      className="app-store-badge"
      target="_blank"
      rel="noreferrer"
      aria-label={`Download ${appName} on the App Store`}
    >
      <img src="/badges/app-store-black.svg" alt="" width={120} height={40} />
    </a>
  );
}
