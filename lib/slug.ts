const WHITESPACE_REGEX = /[\s\-_]+/g;
const INVALID_CHAR_REGEX = /[^a-z0-9-]/g;
const MULTI_DASH_REGEX = /-+/g;

/**
 * Basic slug generator that:
 * - normalizes accents,
 * - lowercases,
 * - removes invalid characters,
 * - collapses whitespace & dashes
 */
export function createSlug(input: string): string {
  const normalized = input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(WHITESPACE_REGEX, "-")
    .replace(INVALID_CHAR_REGEX, "")
    .replace(MULTI_DASH_REGEX, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "urun";
}



