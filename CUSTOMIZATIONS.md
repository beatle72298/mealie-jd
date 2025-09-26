# Mealie-JD Custom Modifications

This document outlines all custom modifications made to this Mealie fork.

## Summary of Changes

This fork includes several user experience improvements focused on recipe presentation and media integration:

1. **Recipe Notes Repositioning**: Moved notes above recipe instructions for better workflow
2. **Cook Mode Enhancement**: Added notes to the top of cook mode for quick reference
3. **YouTube Video Integration**: Embedded YouTube videos directly in recipe images
4. **URL Linking**: Made recipe images clickable when URLs are found in recipe content

## File Modifications

### 1. Recipe Page Layout Changes

**File:** `frontend/components/Domain/Recipe/RecipePage/RecipePage.vue`

**Changes Made:**
- **Line 61**: Moved `<RecipeNotes>` component above `<RecipePageInstructions>` component
- **Lines 95-100**: Added notes section to two-column cook mode layout
- **Lines 125-131**: Added notes section to single-column cook mode layout

**Purpose:**
- Display notes before cooking instructions in normal view
- Show notes at the top of cook mode for easy reference while cooking

### 2. YouTube and URL Media Integration

**File:** `frontend/components/Domain/Recipe/RecipePage/RecipePageParts/RecipePageInfoCardImage.vue`

**Changes Made:**
- **Lines 3-23**: Added YouTube iframe inside v-img element when YouTube URL detected
- **Lines 25-37**: Added clickable link wrapper when non-YouTube URL detected
- **Lines 39-49**: Preserved original v-img behavior when no URLs found
- **Lines 91**: Added import for new media utility functions
- **Lines 126-129**: Added media detection logic using new utility
- **Lines 131-136**: Added YouTube embed URL generation

**Purpose:**
- Embed YouTube videos directly in recipe images
- Make recipe images clickable for external recipe links
- Maintain responsive behavior using v-img container system

### 3. Media Detection Utilities

**File:** `frontend/composables/use-recipe-media.ts` *(New File)*

**Functions Added:**
- `extractUrls()`: Detects URLs in text using comprehensive regex
- `extractYouTubeVideoId()`: Extracts video IDs from various YouTube URL formats
- `isYouTubeUrl()`: Checks if URL is a YouTube video
- `extractRecipeMedia()`: Analyzes recipe description and notes for media content
- `getYouTubeEmbedUrl()`: Generates YouTube embed URLs with optimal parameters

**Purpose:**
- Centralized media detection and processing logic
- Support multiple YouTube URL formats (youtu.be, youtube.com/watch, etc.)
- Extract URLs from both recipe descriptions and notes

### 4. Deployment Configuration

**File:** `docker-compose.personal.yml` *(New File)*

**Configuration Added:**
- Personal deployment setup with `pull_policy: always`
- Environment variables for local development
- Volume mapping for persistent data
- Port mapping (9000:9000)

**File:** `build-and-push.sh` *(New File)*

**Script Features:**
- Automated Docker build and push to GitHub Container Registry
- Version tagging support
- Both latest and versioned tags
- Success/failure reporting

## How the Features Work

### Recipe Notes Enhancement

1. **Normal View**: Notes now appear between the recipe info and cooking instructions
2. **Cook Mode**: Notes appear at the very top with a light grey background for visibility
3. **Responsive**: Works across all screen sizes and cook mode layouts

### YouTube Integration

1. **URL Detection**: Scans recipe description and notes for YouTube URLs
2. **Video Embedding**: When found, displays YouTube iframe inside the recipe image container
3. **Responsive**: Uses v-img's responsive system for proper scaling
4. **Multiple Formats**: Supports youtu.be, youtube.com/watch, youtube.com/embed formats

### Link Integration

1. **URL Detection**: Finds any HTTP/HTTPS URLs in recipe content
2. **Image Linking**: Makes the entire recipe image clickable
3. **External Links**: Opens in new tab with proper security attributes
4. **Fallback**: Regular image behavior when no URLs found

## Version History

- **v1.0.3**: Initial notes repositioning
- **v1.0.4**: Added cook mode notes and YouTube embed foundation
- **v1.0.5**: Simplified YouTube controls to use native player
- **v1.0.6**: Fixed YouTube iframe overlay positioning
- **v1.0.7**: Final fix - YouTube iframe properly inside v-img element

## Container Registry

**Public Image:** `ghcr.io/beatle72298/mealie-jd:latest`

**Deployment:**
```bash
docker pull ghcr.io/beatle72298/mealie-jd:latest
docker run -d -p 9000:9000 -v mealie-data:/app/data ghcr.io/beatle72298/mealie-jd:latest
```

## Testing URLs

To test the new features, add these to a recipe's description or notes:

**YouTube URLs:**
- `https://youtu.be/dQw4w9WgXcQ`
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

**Regular URLs:**
- `https://www.allrecipes.com/recipe/123456/example-recipe/`

The recipe image will either embed the YouTube video or become a clickable link to the external recipe.