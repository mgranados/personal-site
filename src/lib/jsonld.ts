/**
 * Serialize a JSON-LD object for inline injection via `set:html` into a
 * `<script type="application/ld+json">`. Escapes the characters that could
 * otherwise break out of the <script> element — chiefly a literal "</script>"
 * appearing inside any string field. The content is parsed as JSON (not executed
 * as JS), so escaping `<`, `>` and `&` is sufficient to keep it inert.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
