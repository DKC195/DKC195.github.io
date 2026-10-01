"use client";

import { useEffect, useState } from "react";

const GOOGLE_ANALYTICS_ID = "G-6YX4MSCHKE";
const CONSENT_KEY = "analytics-consent";

type ConsentChoice = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    setChoice(savedChoice);

    if (savedChoice === "accepted") {
      loadAnalytics();
    }

    const resetConsent = () => setChoice(null);
    window.addEventListener("analytics-consent-reset", resetConsent);
    return () => window.removeEventListener("analytics-consent-reset", resetConsent);
  }, []);

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    setChoice(nextChoice);

    if (nextChoice === "accepted") {
      loadAnalytics();
    }
  }

  if (choice) {
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

function loadAnalytics() {
  if (document.querySelector(`script[data-google-analytics="${GOOGLE_ANALYTICS_ID}"]`)) {
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
