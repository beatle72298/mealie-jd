<template>
  <!-- YouTube embed over image -->
  <div v-if="mediaInfo?.type === 'youtube'" class="position-relative">
    <v-img
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
    <div class="youtube-overlay">
      <iframe
        :src="youTubeEmbedUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        class="youtube-iframe"
      ></iframe>
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
.youtube-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.youtube-iframe {
  display: block;
  border-radius: 4px;
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
