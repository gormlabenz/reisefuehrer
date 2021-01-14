<template>
  <div class="ion-justify-content-center ion-align-items-center">
    <ion-button shape="round" size="small" fill="clear">
      <ion-icon slot="icon-only" :icon="playSkipBackOutline"></ion-icon>
    </ion-button>

    <ion-button
      v-if="!isPlaying"
      @click="play"
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
    <ion-button v-else @click="pause" shape="round" size="large" fill="clear">
      <ion-icon
        class="icon-large"
        size="large"
        slot="icon-only"
        :icon="pauseCircleOutline"
      ></ion-icon>
    </ion-button>

    <ion-button @click="skip" shape="round" size="small" fill="clear">
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

const { Media } = require("@ionic-native/media");
export default defineComponent({
  props: { big: { type: Boolean, default: false } },
  data() {
    return {
      media: null,
      isPlaying: false,
      position: null,
      display_position: "00:00",
      duration: -1,
      playCircleOutline,
      playOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
      pauseCircleOutline,
    };
  },
  mounted() {
    this.preloadMedia();
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
  },
  methods: {
    preloadMedia() {
      this.TrackStore.fetchTrack();
      this.media = Media.create(this.url);
      this.media.onStatusUpdate.subscribe((status) => {
        switch (status) {
          case 1:
            break;
          case 2: // 2: playing
            this.isPlaying = true;
            break;
          case 3: // 3: pause
            this.isPlaying = false;
            break;
          case 4: // 4: stop
          default:
            this.isPlaying = false;
            break;
        }
        this.TrackStore.setIsPlaying(this.isPlaying);
      });
    },
    play() {
      this.media.play();
    },
    pause() {
      this.media.pause();
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
