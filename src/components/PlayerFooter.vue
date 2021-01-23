<template>
  <ion-footer style="margin-bottom: -64px">
    <!-- <ion-progress-bar
      v-if="trackLoading"
      color="dark"
      type="indeterminate"
    ></ion-progress-bar> -->

    <ion-toolbar class="footer">
      <ion-buttons class="icon-small" slot="end">
        <Player :big="false"></Player>
      </ion-buttons>
      <ion-buttons slot="start">
        <ion-img
          @click.self="$emit('modal')"
          class="ion-margin-start"
          style="width:36px; height:36px"
          :src="track.mainImage.thumb"
        ></ion-img
      ></ion-buttons>
      <h4
        @click.self="$emit('modal')"
        class="ion-margin-start"
        style="margin: 0 0 0 16px;"
      >
        {{ TextStore.truncate(track.title, 14, false) }}
      </h4>
    </ion-toolbar>
  </ion-footer>
</template>

<script>
import {
  IonFooter,
  IonProgressBar,
  IonButtons,
  IonImg,
  IonToolbar,
} from "@ionic/vue";

import TextStore from "../store/text.js";
import TrackStore from "../store/track.js";
import Store from "../store";

import Player from "../components/Player.vue";

export default {
  computed: {
    TextStore() {
      return TextStore();
    },
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
          title: "Loading…",
          mainImage: { thumb: Store().defaultImage.value },
        };
      }
    },
  },
  components: {
    IonFooter,
    IonProgressBar,
    IonButtons,
    IonImg,
    IonToolbar,
    Player,
  },
};
</script>

<style>
.footer {
  --min-height: 64px;
}
</style>
