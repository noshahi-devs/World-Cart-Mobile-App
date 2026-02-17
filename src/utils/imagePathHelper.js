export const resolveImagePath = (rawPath) => {
    if (!rawPath || rawPath === 'string' || rawPath.trim() === '') {
        return 'https://via.placeholder.com/300x400?text=No+Image';
    }

    let cleaned = rawPath.trim();

    // 1. Remove JSON artifacts (e.g., ["url"], \"url\", or \"[\\\"url\\\"]\")
    cleaned = cleaned
        .replace(/^\["/, '')      // Remove start of array ["
        .replace(/"\]$/, '')      // Remove end of array "]
        .replace(/^\\"/, '')     // Remove escaped start quote \"
        .replace(/\\"$/, '')     // Remove escaped end quote \"
        .replace(/^"/, '')       // Remove start quote "
        .replace(/"$/, '')       // Remove end quote "
        .replace(/\\"/g, '');    // Remove all remaining escaped quotes

    // 2. Handle comma-separated lists (Take the first image)
    if (cleaned.includes('","')) {
        cleaned = cleaned.split('","')[0];
    } else if (cleaned.includes(',')) {
        cleaned = cleaned.split(',')[0];
    }

    cleaned = cleaned.trim();

    // 3. Resolve Absolute vs Relative
    if (cleaned.startsWith('http')) {
        return cleaned;
    }

    // Prepend Base URL (ensure no double slashes)
    const baseUrl = "https://app-elicom-backend.azurewebsites.net";
    const path = cleaned.startsWith('/') ? cleaned.substring(1) : cleaned;

    return `${baseUrl}/${path}`;
};
