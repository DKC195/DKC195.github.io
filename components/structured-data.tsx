/**
 * Renders a JSON-LD structured-data block. Server component: the JSON is
 * serialized at build time and emitted into the static HTML head/body.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
