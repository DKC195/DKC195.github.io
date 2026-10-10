"use client";

import { useEffect, useState } from "react";

const GOOGLE_ANALYTICS_ID = "G-6YX4MSCHKE";
const CONSENT_KEY = "analytics-consent";

type ConsentChoice = "accepted" | "rejected";

// Regions where analytics cookies need prior opt-in consent: EU/EEA (GDPR + ePrivacy),
// UK (UK GDPR + PECR), and Switzerland. Detected from the browser timezone because the
// static export has no server-side geo lookup, and a third-party geo-IP call would itself
// share the visitor's IP before consent. Every `Europe/*` zone counts (deliberately broad).
const CONSENT_TIMEZONE_PREFIXES = ["Europe/"];
const CONSENT_TIMEZONES = new Set([
  // EU/EEA territories outside `Europe/*`
  "Africa/Ceuta",
  "America/Cayenne",
  "America/Guadeloupe",
  "America/Marigot",
  "America/Martinique",
  "America/St_Barthelemy",
  "Arctic/Longyearbyen",
  "Asia/Famagusta",
  "Asia/Nicosia",
  "Atlantic/Azores",
  "Atlantic/Canary",
  "Atlantic/Faeroe",
  "Atlantic/Faroe",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
  "Indian/Mayotte",
  "Indian/Reunion",
  // Legacy aliases some browsers still report
  "CET",
  "EET",
  "Eire",
  "GB",
  "GB-Eire",
  "Iceland",
  "MET",
  "Poland",
  "Portugal",
  "WET"
]);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

export function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;

    if (savedChoice === "accepted") {
      loadAnalytics();
    } else if (!savedChoice) {
      if (requiresConsent()) {
        setShowBanner(true);
      } else {
        loadAnalytics();
      }
    }

    // Explicit requests from the privacy page always show the banner, in every region.
    const resetConsent = () => setShowBanner(true);
    window.addEventListener("analytics-consent-reset", resetConsent);
    return () => window.removeEventListener("analytics-consent-reset", resetConsent);
  }, []);

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    setShowBanner(false);

    if (nextChoice === "accepted") {
      loadAnalytics();
    } else {
      disableAnalytics();
    }
  }

  if (!showBanner) {
    return null;
  }

  return (
    <aside className="consent-banner" aria-label="Analytics consent">
      <div className="consent-banner-copy">
        <p className="consent-banner-title">A note about analytics</p>
        <p>
          This site uses Google Analytics to understand which pages are useful. You can accept or reject
          analytics cookies. <a href="/privacy/">Read the privacy note</a>.
        </p>
      </div>
      <div className="consent-banner-actions">
        <button type="button" className="button-ghost" onClick={() => saveChoice("rejected")}>
          Reject
        </button>
        <button type="button" className="button" onClick={() => saveChoice("accepted")}>
          Accept analytics
        </button>
      </div>
    </aside>
  );
}

export function ConsentPreferences() {
  return (
    <button
      type="button"
      className="button-ghost"
      onClick={() => {
        window.localStorage.removeItem(CONSENT_KEY);
        window.dispatchEvent(new Event("analytics-consent-reset"));
      }}
    >
      Change analytics preference
    </button>
  );
}

function requiresConsent() {
  let timeZone: string | undefined;
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return true;
  }

  // Unknown or generic zones (UTC, Etc/*) can't be placed, so ask to be safe.
  if (!timeZone || timeZone === "UTC" || timeZone.startsWith("Etc/")) {
    return true;
  }

  return (
    CONSENT_TIMEZONES.has(timeZone) ||
    CONSENT_TIMEZONE_PREFIXES.some((prefix) => timeZone.startsWith(prefix))
  );
}

function disableAnalytics() {
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

function loadAnalytics() {
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = false;

  if (document.querySelector(`script[data-google-analytics="${GOOGLE_ANALYTICS_ID}"]`)) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  window.dataLayer = window.dataLayer || [];
  // gtag.js only processes `arguments` objects; pushing a plain array (e.g. rest params) is ignored.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  script.dataset.googleAnalytics = GOOGLE_ANALYTICS_ID;
  script.onload = () => {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ANALYTICS_ID);
  };
  document.head.appendChild(script);
}
