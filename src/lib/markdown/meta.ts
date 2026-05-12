const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Strip Markdown syntax for use in meta description tags.
 * Returns plain text, trimmed, limited to ~160 characters.
 */
export function stripMarkdownForMeta(md: string): string {
  if (!md) {
    return "";
  }

  let text = md;

  // Remove code blocks (```...``` or ~~~...~~~)
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/~~~[\s\S]*?~~~/g, "");

  // Remove images, extract alt text: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Convert links to text: [text](url) → text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Remove inline code backticks
  text = text.replace(/`([^`]*)`/g, "$1");

  // Remove bold/italic markers
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "$1"); // ***bold italic***
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");     // **bold**
  text = text.replace(/\*([^*]+)\*/g, "$1");          // *italic*
  text = text.replace(/___([^_]+)___/g, "$1");        // ___bold italic___
  text = text.replace(/__([^_]+)__/g, "$1");          // __bold__
  text = text.replace(/_([^_]+)_/g, "$1");            // _italic_

  // Remove strikethrough
  text = text.replace(/~~([^~]+)~~/g, "$1");

  // Remove headings markers
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove blockquotes
  text = text.replace(/^>\s*/gm, "");

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}\s*$/gm, "");

  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, "");       // unordered
  text = text.replace(/^[\s]*\d+\.\s+/gm, "");        // ordered

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Collapse whitespace: newlines → spaces, trim multiple spaces
  text = text.replace(/\n+/g, " ");
  text = text.replace(/\s+/g, " ");

  // Trim
  text = text.trim();

  // Limit length, break at word boundary
  if (text.length <= MAX_DESCRIPTION_LENGTH) {
    return text;
  }

  const truncated = text.slice(0, MAX_DESCRIPTION_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace);
  }

  return truncated;
}
