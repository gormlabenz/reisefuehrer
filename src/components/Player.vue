<template>
  <div class="ion-justify-content-center ion-align-items-center">
    <ion-button
      @click="TrackStore.skipBack()"
      shape="round"
      :size="smallIconSize"
      fill="clear"
      :disabled="disableSkipBack"
    >
      <ion-icon
        slot="icon-only"
        :size="smallIconSize"
        :icon="playSkipBackOutline"
      ></ion-icon>
    </ion-button>

    <ion-button
      v-if="!isPlaying"
      @click="TrackStore.play()"
      shape="round"
      :size="bigIconSize"
      fill="clear"
    >
      <ion-icon
        v-bind:class="{ 'icon-large': big }"
        :size="bigIconSize"
        slot="icon-only"
        :icon="playIcon"
      ></ion-icon>
    </ion-button>
    <ion-button
      v-else
      @click="TrackStore.pause()"
      shape="round"
      fill="clear"
      :size="bigIconSize"
    >
      <ion-icon
        v-bind:class="{ 'icon-large': big }"
        :size="bigIconSize"
        slot="icon-only"
        :icon="pauseIcon"
      ></ion-icon>
    </ion-button>

    <ion-button
      @click="TrackStore.skip()"
      shape="round"
      :size="smallIconSize"
      fill="clear"
      :disabled="disableSkip"
    >
      <ion-icon
        slot="icon-only"
        :size="smallIconSize"
        :icon="playSkipForwardOutline"
      ></ion-icon>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TrackStore from "../store/track.js";
import { IonButton, IonButtons, IonIcon } from "@ionic/vue";

import {
  playCircleOutline,
  playOutline,
  pauseOutline,
  pauseCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
  locationOutline,
} from "ionicons/icons";

export default defineComponent({
  props: { big: { type: Boolean, default: false } },
  data() {
    return {
      playCircleOutline,
      playOutline,
      pauseOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
      pauseCircleOutline,
      locationOutline,
    };
  },
  computed: {
    disableSkip() {
      if (TrackStore().lastTrack.value) {
        return true;
      } else {
        return false;
      }
    },
    disableSkipBack() {
      if (TrackStore().firstTrack.value) {
        return true;
      } else {
        return false;
      }
    },
    playIcon() {
      if (this.big) {
        return this.playCircleOutline;
      } else {
        return this.playOutline;
      }
    },
    pauseIcon() {
      if (this.big) {
        return this.pauseCircleOutline;
      } else {
        return this.pauseOutline;
      }
    },
    bigIconSize() {
      if (this.big) {
        return "large";
      } else {
        return "default";
      }
    },
    smallIconSize() {
      if (this.big) {
        return "default";
      } else {
        return "default";
      }
    },
    track() {
      return TrackStore().track.value;
    },
    TrackStore() {
      return TrackStore();
    },
    isPlaying() {
      return TrackStore().isPlaying.value;
    },
  },
  components: {
    IonButton,
    IonButtons,
    IonIcon,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}
.icon-large {
  --ionicon-stroke-width: 24px;
}
.text-light {
  color: red;
  background-color: turquoise;
}
</style>
