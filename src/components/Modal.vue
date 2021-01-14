<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ track.title.replace(/\(.*?\)/, "") }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="$emit('dismissed-model')">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="ion-text-center ion-margin-top">
      <ion-grid>
        <img :src="track.mainImage.url" />

        <ion-row class="ion-margin-top">
          <ion-progress-bar
            v-if="trackLoading"
            color="dark"
            type="indeterminate"
          ></ion-progress-bar>
          <ion-progress-bar v-else color="dark" value=".4"></ion-progress-bar>
        </ion-row>

        <ion-row class="ion-justify-content-between">
          <ion-card-subtitle>0.40</ion-card-subtitle>
          <ion-card-subtitle class="light-text">{{
            duration
          }}</ion-card-subtitle>
        </ion-row>

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
          <ion-button
            v-else
            @click="pause"
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

          <ion-button @click="skip" shape="round" size="small" fill="clear">
            <ion-icon
              class="icon-small"
              size="small"
              slot="icon-only"
              :icon="playSkipForwardOutline"
            ></ion-icon>
          </ion-button>
        </ion-row>
      </ion-grid>
    </div>

    <div>
      <h1>{{ track.title }}</h1>
      <p>
        {{ track.summary }}
      </p>
    </div>
    <audio
      id="audio"
      class="ion-hide"
      :src="serverUrl + track.pageID + '.mp3'"
    ></audio>
  </ion-content>
</template>

<script>
import TrackStore from "../store/track.js";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonCardSubtitle,
  IonGrid,
  IonRow,
} from "@ionic/vue";

import {
  playCircleOutline,
  pauseCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {},
  data() {
    return {
      content: "Content",
      playCircleOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
      pauseCircleOutline,
    };
  },
  computed: {
    duration() {
      return TrackStore().duration.value;
    },
    audioPlaying() {
      return TrackStore().audioPlaying.value;
    },
    audioDuration() {
      return TrackStore().audioDuration.value;
    },
    TrackStore() {
      return TrackStore();
    },
    trackLoading() {
      return TrackStore().trackLoading.value;
    },
    track() {
      return TrackStore().track.value;
    },
    serverUrl() {
      return TrackStore().serverUrl.value;
    },
    audio() {
      return TrackStore().audio.value;
    },
    url() {
      return this.serverUrl + "/storys/" + this.track.pageID + ".mp3";
    },
  },
  methods: {
    play() {
      this.TrackStore.play();
    },
    pause() {
      this.TrackStore.pause();
    },
    skip() {
      console.log("duration", this.audio.duration());
      console.log("paused", this.audio.paused);
      console.log("audioPlaying", this.audioPlaying);
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonImg,
    IonIcon,
    IonProgressBar,
    IonCardSubtitle,
    IonGrid,
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
