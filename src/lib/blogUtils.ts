
// Helper function to generate dynamic read time
export function calculateReadTime(content: string): string {
  if (!content) return "1 mnt baca";
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} mnt baca`;
}

// Helper function to strip markdown and generate clean excerpt
export function generateExcerpt(content: string): string {
  if (!content) return "";
  // Simple markdown stripping
  const clean = content
    .replace(/[#*`_\[\]()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  
  if (clean.length <= 160) return clean;
  return clean.slice(0, 157) + "...";
}
