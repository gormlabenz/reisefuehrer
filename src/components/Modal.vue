<template>
  <div id="modal" style="margin-top: 100vh">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ track.title.replace(/\(.*?\)/, "") }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('dismissed-model')">Close</ion-button>
        </ion-buttons>
        <ion-progress-bar
          v-if="trackLoading"
          color="dark"
          type="indeterminate"
        ></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ion-text-center ion-margin-top">
        <ion-grid>
          <img :src="track.mainImage.url" />
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <Player :big="true"></Player>
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
  </div>
</template>

<script>
import TrackStore from "../store/track.js";
import Store from "../store";
import { arrowBackOutline } from "ionicons/icons";
import Player from "./Player.vue";
import { defineComponent } from "vue";

import gsap from "gsap";

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
  props: { active: Boolean },
  data() {
    return {
      arrowBackOutline,
    };
  },
  watch: {
    active(val) {
      console.log("modal watcher", val);
      let top;
      if (val) {
        top = 0;
      } else {
        top = 100;
      }
      gsap.to("#footer", {
        "margin-top": top,
        duration: 0.2,
        ease: "Power3.easeInOut",
        onComplete: this.$emit("modal"),
      });
    },
  },
  computed: {
    TrackStore() {
      return TrackStore();
    },
    trackLoading() {
      return TrackStore().trackLoading.value;
    },
    track() {
      if (TrackStore().track.value) {
        return TrackStore().track.value;
      } else {
        return {
          title: "Loading",
          summary: "…",
          mainImage: { url: Store().defaultImage.value },
        };
      }
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
