<template>
  <!-- YouTube embed overlay -->
  <div v-if="mediaInfo?.type === 'youtube'" class="position-relative youtube-container">
    <!-- Recipe image (hidden when video is playing) -->
    <v-img
      v-show="!showYouTubeEmbed"
      :key="imageKey"
      :max-width="maxWidth"
      min-height="50"
      cover
      width="100%"
      :height="hideImage ? undefined : imageHeight"
      :src="recipeImageUrl"
      class="d-print-none recipe-image-with-youtube"
      @error="hideImage = true"
    />

    <!-- YouTube iframe (shown when playing) -->
    <div
      v-show="showYouTubeEmbed"
      class="youtube-embed-container"
      :style="{height: imageHeight + 'px'}"
    >
      <iframe
        :src="youTubeEmbedUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        class="youtube-iframe"
      />
    </div>

    <!-- Play button overlay (shown when video is not playing) -->
    <div v-show="!showYouTubeEmbed" class="youtube-overlay d-flex align-center justify-center">
      <v-btn
        icon
        size="x-large"
        color="red"
        class="youtube-play-btn"
        @click="showYouTubeEmbed = true"
      >
        <v-icon size="large">mdi-play</v-icon>
      </v-btn>
    </div>

    <!-- Close button (shown when video is playing) -->
    <div v-show="showYouTubeEmbed" class="youtube-close-btn">
      <v-btn
        icon
        size="small"
        color="white"
        class="close-btn"
        @click="showYouTubeEmbed = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>

  <!-- Regular link wrapper -->
  <a
    v-else-if="mediaInfo?.type === 'link'"
    :href="mediaInfo.url"
    target="_blank"
    rel="noopener noreferrer"
    class="recipe-link-wrapper"
  >
    <v-img
      :key="imageKey"
      :max-width="maxWidth"
      min-height="50"
      cover
      width="100%"
      :height="hideImage ? undefined : imageHeight"
      :src="recipeImageUrl"
      class="d-print-none recipe-image-linked"
      @error="hideImage = true"
    />
  </a>

  <!-- Default image (no URL found) -->
  <v-img
    v-else
    :key="imageKey"
    :max-width="maxWidth"
    min-height="50"
    cover
    width="100%"
    :height="hideImage ? undefined : imageHeight"
    :src="recipeImageUrl"
    class="d-print-none"
    @error="hideImage = true"
  />
</template>

<script setup lang="ts">
import { useStaticRoutes, useUserApi } from "~/composables/api";
import type { HouseholdSummary } from "~/lib/api/types/household";
import { usePageState, usePageUser } from "~/composables/recipe-page/shared-state";
import type { Recipe } from "~/lib/api/types/recipe";
import type { NoUndefinedField } from "~/lib/api/types/non-generated";
import { extractRecipeMedia, getYouTubeEmbedUrl } from "~/composables/use-recipe-media";

interface Props {
  recipe: NoUndefinedField<Recipe>;
  maxWidth?: string;
}
const props = withDefaults(defineProps<Props>(), {
  maxWidth: undefined,
});

const display = useDisplay();
const { recipeImage } = useStaticRoutes();
const { imageKey } = usePageState(props.recipe.slug);
const { user } = usePageUser();

const recipeHousehold = ref<HouseholdSummary>();
if (user) {
  const userApi = useUserApi();
  userApi.households.getOne(props.recipe.householdId).then(({ data }) => {
    recipeHousehold.value = data || undefined;
  });
}

const hideImage = ref(false);
const showYouTubeEmbed = ref(false);

const imageHeight = computed(() => {
  return display.xs.value ? "200" : "400";
});

const recipeImageUrl = computed(() => {
  return recipeImage(props.recipe.id, props.recipe.image, imageKey.value);
});

// Extract media information from recipe description and notes
const mediaInfo = computed(() => {
  return extractRecipeMedia(props.recipe.description, props.recipe.notes);
});

// Generate YouTube embed URL if applicable
const youTubeEmbedUrl = computed(() => {
  if (mediaInfo.value?.type === 'youtube' && mediaInfo.value.videoId) {
    return getYouTubeEmbedUrl(mediaInfo.value.videoId);
  }
  return '';
});

watch(
  () => recipeImageUrl.value,
  () => {
    hideImage.value = false;
  },
);
</script>

<style scoped>
.youtube-container {
  width: 100%;
}

.youtube-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
  transition: all 0.3s ease;
  cursor: pointer;
}

.youtube-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}

.youtube-play-btn {
  background: #ff0000 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.youtube-play-btn:hover {
  transform: scale(1.1);
}

.youtube-embed-container {
  width: 100%;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
}

.youtube-iframe {
  display: block;
  border-radius: 4px;
}

.youtube-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.close-btn {
  background: rgba(0, 0, 0, 0.7) !important;
  color: white !important;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9) !important;
}

.recipe-image-linked {
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.recipe-image-linked:hover {
  opacity: 0.8;
}

.recipe-link-wrapper {
  text-decoration: none;
  display: block;
}
</style>
