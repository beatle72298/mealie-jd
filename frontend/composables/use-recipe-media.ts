/**
 * Utilities for extracting and handling media from recipe content
 */

export interface MediaInfo {
  url: string;
  type: 'youtube' | 'link';
  videoId?: string;
}

/**
 * Extract URLs from text using a comprehensive regex
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  return text.match(urlRegex) || [];
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Check if a URL is a YouTube video URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Extract media information from recipe description and notes
 */
export function extractRecipeMedia(description: string | null, notes: Array<{title: string, text: string}> | null): MediaInfo | null {
  const allText = [
    description || '',
    ...(notes || []).map(note => `${note.title} ${note.text}`)
  ].join(' ');

  const urls = extractUrls(allText);

  if (urls.length === 0) {
    return null;
  }

  // Prioritize YouTube URLs
  for (const url of urls) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return {
        url,
        type: 'youtube',
        videoId
      };
    }
  }

  // Return first non-YouTube URL as a regular link
  return {
    url: urls[0],
    type: 'link'
  };
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
}