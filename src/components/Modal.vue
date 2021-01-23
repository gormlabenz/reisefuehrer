<template>
  <div ref="modal" style="margin-top: 100vh; ">
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
    <ion-content class="ion-padding" style="position: absolute;">
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
import { createGesture } from "@ionic/core";

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
  data() {
    return {
      arrowBackOutline,
      el: null,
    };
  },

  mounted() {
    this.el = this.$refs.modal;
    console.log(this.el);
    this.gestureFunc();
  },
  methods: {
    async gestureFunc() {
      const gestureOptions = {
        el: this.el,
        gestureName: "swipe",
        direction: "y",
        onStart: () => {},
        onMove: () => {},
        onEnd: (ev) => {
          if (ev.deltaY > 100) {
            this.$emit("dismissed-model");
          }
        },
      };

      const gesture = await createGesture(gestureOptions);
      gesture.enable();
      console.log(gesture);
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
