<template>
  <ion-page>
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
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <Player :big="true"></Player>
          </ion-row>
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
            <ion-card-subtitle class="light-text">1.40</ion-card-subtitle>
          </ion-row>
        </ion-grid>
      </div>

      <div>
        <h1>{{ track.title }}</h1>
        <p>
          {{ track.summary }}
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import TrackStore from "../store/track.js";
import { arrowBackOutline } from "ionicons/icons";
import Player from "./Player.vue";
import { defineComponent } from "vue";
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

export default defineComponent({
  name: "Modal",
  props: {},
  data() {
    return {
      arrowBackOutline,
    };
  },
  computed: {
    TrackStore() {
      return TrackStore();
    },
    trackLoading() {
      return TrackStore().trackLoading.value;
    },
    track() {
      return TrackStore().track.value;
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
    Player,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}

.icon-large {
  zoom: 1.5;
}

.text-light {
  color: red;
  background-color: turquoise;
}
</style>
