<template>
  <ion-footer
    id="footer"
    style="margin-bottom: -64px; position: fixed; left: 0; bottom: 0;"
  >
    <ion-toolbar class="footer">
      <ion-progress-bar
        v-if="trackLoading"
        color="dark"
        type="indeterminate"
      ></ion-progress-bar>
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
        class="ion-margin-start ion-text-nowrap"
        style="margin: 0 0 0 16px; width: 80%; text-overflow: ellipsis; overflow: hidden;"
      >
        {{ track.title }}
      </h4>
    </ion-toolbar>
    <!--  -->
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
        return Store().defaultPage.value;
      }
    },
  },
  mounted() {
    this.width = document.getElementById("footer").offsetWidth;
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
