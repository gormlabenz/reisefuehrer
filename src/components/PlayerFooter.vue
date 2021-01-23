<template>
  <ion-footer id="footer" style="margin-bottom: -64px">
    <ion-progress-bar
      v-if="TrackStore.trackLoading.value"
      color="dark"
      type="indeterminate"
    ></ion-progress-bar>

    <ion-toolbar class="footer">
      <ion-buttons class="icon-small" slot="end">
        <Player :big="false"></Player>
      </ion-buttons>
      <ion-buttons slot="start">
        <ion-img
          @click.self="toogleFooter"
          class="ion-margin-start"
          style="width:36px; height:36px"
          :src="track.mainImage.thumb"
        ></ion-img
      ></ion-buttons>
      <h4
        @click.self="toogleFooter"
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
import Player from "../components/Player.vue";

import gsap from "gsap";

export default {
  data() {
    return {
      pos: -64,
    };
  },
  computed: {
    TextStore() {
      return TextStore();
    },
    TrackStore() {
      return TrackStore();
    },
    track() {
      return TrackStore().track.value;
    },
  },
  mounted() {
    this.animateFooter(0);
  },
  methods: {
    animateFooter(value) {
      console.log("toogleFooter", this.footer);
      gsap.to("#footer", {
        "margin-bottom": value + "px",
        duration: 0.2,
        ease: "Power3.easeInOut",
      });
    },
    toogleFooter() {
      this.animateFooter(this.pos);
      this.pos = this.pos == -64 ? 0 : -64;
      this.$emit("modal");
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
