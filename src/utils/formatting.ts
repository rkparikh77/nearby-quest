/**
 * Format price level (0-4) to dollar signs
 */
export function formatPriceLevel(priceLevel?: number): string {
  if (priceLevel === undefined || priceLevel === null) return '';
  return '$'.repeat(priceLevel || 1);
}

/**
 * Format rating to one decimal place
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format number of reviews
 */
export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  return `/api/places/photos/${photoReference}?maxwidth=${maxWidth}`;
}
