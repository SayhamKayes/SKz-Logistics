/**
 * Computes the initials for the administrator full name according to SAIN rules:
 * - Single Name: Takes only 1 letter (e.g. "Sakib" -> "S")
 * - Two Names: Takes the first letter of First Name and first letter of Last Name (e.g. "Sakib Ahmed" -> "SA")
 * - Three or more words: Only takes the first two words' initials and ignores all subsequent words (e.g. "Sayham Kayes Khan" -> "SK")
 * - Fallback: "A" if empty
 */
export function getAdminInitials(fullName?: string | null): string {
  if (!fullName) return 'A';
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'A';
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}
