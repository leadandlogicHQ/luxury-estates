import type { JSX } from "react";

type JsonNode = Record<string, unknown>;

export default function JsonLd({ data }: { data: JsonNode | JsonNode[] }): JSX.Element {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}