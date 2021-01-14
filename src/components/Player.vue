<template>
  <ion-row class="ion-justify-content-center ion-align-items-center">
    <ion-button shape="round" size="small" fill="clear">
      <ion-icon
        class="icon-small"
        size="small"
        slot="icon-only"
        :icon="playSkipBackOutline"
      ></ion-icon>
    </ion-button>

    <ion-button
      v-if="!audioPlaying"
      @click="play"
      shape="round"
      size="large"
      fill="clear"
    >
      <ion-icon
        class="icon-large"
        size="large"
        slot="icon-only"
        :icon="playCircleOutline"
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
      <ion-icon
        class="icon-small"
        size="small"
        slot="icon-only"
        :icon="playSkipForwardOutline"
      ></ion-icon>
    </ion-button>
  </ion-row>
</template>

<script>
import { defineComponent } from "vue";
import TrackStore from "../store/track.js";
import { IonButton, IonButtons, IonIcon, IonRow } from "@ionic/vue";

import {
  playCircleOutline,
  pauseCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";

const { Media } = require("@ionic-native/media");
export default defineComponent({
  data() {
    return {
      audioPlaying: false,
      media: null,
      playCircleOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
      pauseCircleOutline,
    };
  },
  mounted() {
    this.media = Media.create(
      this.url,
      // success callback
      function() {
        console.log("playAudio():Audio Success");
      },
      // error callback
      function(err) {
        console.log("playAudio():Audio Error: " + err);
      }
    );
    console.log(this.media);
  },
  computed: {
    track() {
      return TrackStore().track.value;
    },
    serverUrl() {
      return TrackStore().serverUrl.value;
    },
    url() {
      return this.serverUrl + "/storys/" + this.track.pageID + ".mp3";
    },
  },
  methods: {
    play() {
      console.log("playing");
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
    IonRow,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
}
.icon-small {
  --ionicon-stroke-width: 48px;
}
.icon-large {
  zoom: 1.5;
  --ionicon-stroke-width: 36px;
}
.text-light {
  color: red;
  background-color: turquoise;
}
</style>
