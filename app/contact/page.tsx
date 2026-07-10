import { getProfile, getRenderableLinks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Dhiraj KC for collaboration, project work, or conversation — email and profile links.",
  path: "/contact/"
});

export default function ContactPage() {
  const profile = getProfile();
  const contactLinks = getRenderableLinks("contact");

  return (
    <main className="panel section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="section-title">{profile.contactSectionTitle}</h1>
          <p className="section-copy">
            The best ways to reach me for collaboration, project work, or conversation.
          </p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: "1rem" }}>
        {contactLinks.length > 0 ? (
          contactLinks.map((link) => (
            <a key={link.label} href={link.href} className="card" target="_blank" rel="noreferrer">
              <p className="eyebrow">{link.label}</p>
              <h3 style={{ marginBottom: 0 }}>{link.href.replace("mailto:", "")}</h3>
            </a>
          ))
        ) : (
          <div className="empty-state">
            Contact details will appear here soon.
          </div>
        )}
      </div>
    </main>
  );
}
