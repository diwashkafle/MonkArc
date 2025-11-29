export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/[\s_-]+/g, '-')   // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')    // Remove leading/trailing hyphens
    .slice(0, 30)                // Max 30 chars
}