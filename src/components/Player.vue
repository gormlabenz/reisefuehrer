<template>
  <div class="ion-justify-content-center ion-align-items-center">
    <ion-button
      @click="TrackStore.skipBack()"
      shape="round"
      size="small"
      fill="clear"
    >
      <ion-icon slot="icon-only" :icon="playSkipBackOutline"></ion-icon>
    </ion-button>

    <ion-button
      v-if="!isPlaying"
      @click="TrackStore.play()"
      shape="round"
      size="large"
      fill="clear"
    >
      <ion-icon
        v-bind:class="{ 'icon-large': big }"
        size="large"
        slot="icon-only"
        :icon="playIcon"
      ></ion-icon>
    </ion-button>
    <ion-button
      v-else
      @click="TrackStore.pause()"
      shape="round"
      size="large"
      fill="clear"
    >
      <ion-icon
        class="icon-large"
        size="large"
        slot="icon-only"
        :icon="pauseCircleOutline"
      ></ion-icon>
    </ion-button>

    <ion-button
      @click="TrackStore.skip()"
      shape="round"
      size="small"
      fill="clear"
    >
      <ion-icon slot="icon-only" :icon="playSkipForwardOutline"></ion-icon>
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
  pauseCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";

export default defineComponent({
  props: { big: { type: Boolean, default: false } },
  data() {
    return {
      playCircleOutline,
      playOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
      pauseCircleOutline,
    };
  },
  mounted() {
    this.TrackStore.preloadMedia();
  },
  computed: {
    playIcon() {
      if (this.big) {
        return this.playCircleOutline;
      } else {
        return this.playOutline;
      }
    },
    track() {
      return TrackStore().track.value;
    },
    serverUrl() {
      return TrackStore().serverUrl.value;
    },
    url() {
      return this.serverUrl + "/storys/" + this.track.pageID + ".mp3";
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
