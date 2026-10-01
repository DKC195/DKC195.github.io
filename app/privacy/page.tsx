import { ConsentPreferences } from "@/components/analytics-consent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy and analytics information for dhirajkc195.com.np.",
  path: "/privacy/"
});

export default function PrivacyPage() {
  return (
    <main className="panel section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Privacy</p>
          <h1 className="section-title">Privacy and analytics</h1>
          <p className="section-copy">
            This site uses Google Analytics only when you choose to allow analytics cookies.
          </p>
        </div>
      </div>

      <div className="markdown privacy-copy">
        <p>
          This website is operated by Dhiraj KC, based in Nepal. For privacy questions, contact{" "}
          <a href="mailto:dhirajkc195@gmail.com">dhirajkc195@gmail.com</a>.
        </p>

        <h2>Google Analytics</h2>
        <p>
          If you accept analytics, Google Analytics helps measure visits, page views, approximate location,
          and browser or device information so the site can be improved. The legal basis for this optional
          processing is your consent. Google may process this information as described in its{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </p>
        <p>
          Analytics is not loaded before you choose. Rejecting analytics keeps Google Analytics disabled on
          this site. You can change your choice below. The Analytics property is intended for standard
          measurement only; do not send names, email addresses, or other directly identifying information
          through it.
        </p>

        <h2>Google Fonts</h2>
        <p>
          The site loads the Montserrat typeface from Google Fonts for presentation. This is separate from
          Google Analytics and does not depend on your analytics choice. Google may receive technical request
          information when serving the font. See Google&apos;s{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </p>

        <h2>Retention and rights</h2>
        <p>
          Analytics data is retained according to the setting chosen in the Google Analytics property. You
          may withdraw analytics consent at any time using the control below; withdrawing consent stops
          future Analytics collection on this site. You may also contact me with privacy questions or
          requests relating to information associated with this site.
        </p>

        <h2>Site content</h2>
        <p>
          This portfolio does not provide user accounts, payments, or a contact form. Contacting me by email
          is handled through your email provider and may involve the information needed to respond to your
          message.
        </p>

        <div className="privacy-preferences">
          <p className="eyebrow">Your choice</p>
          <p>Change whether this site may use Google Analytics.</p>
          <ConsentPreferences />
        </div>
      </div>
    </main>
  );
}
