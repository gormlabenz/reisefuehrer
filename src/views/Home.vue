<template>
  <ion-page>
    <ion-content
      style="--ion-background-color: none"
      :force-overscroll="true"
      :fullscreen="false"
    >
      <ion-fab
        vertical="top"
        horizontal="end"
        slot="fixed"
        style="margin-top: 20px; margin-right: 10px"
      >
        <ion-fab-button @click="TrackStore.toggleAutoplay()">
          <ion-icon color="light" :icon="autoplayIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <Header></Header>

      <div
        v-if="initLoad"
        style="overflow: scroll; height: 100vh; scroll-snap-type: y mandatory; "
      >
        <spacing></spacing>
        <div
          style="position: sticky; top: 0; z-index: 100; height: 32px; background-color: var(--ion-toolbar-background); border-radius: 32px 32px 0 0; width: 100%; display: flex; justify-content: center; align-items: flex-end; "
        >
          <div
            ref="icon"
            style="width:40px; height: 3px; background-color: var(--ion-color-primary);  border-radius: 1.5px; margin-bottom: 8px"
          ></div>
        </div>
        <places-nearby @modal="modal = true"></places-nearby>
        <recently-played @modal="modal = true"></recently-played>
      </div>
    </ion-content>

    <PlayerFooter id="footer" @modal="modal = true"></PlayerFooter>
  </ion-page>

  <Modal id="modal" @dismissed-model="modal = false"> </Modal>
</template>

<script>
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/vue";

import Modal from "../components/Modal.vue";
import PlayerFooter from "../components/PlayerFooter.vue";
import Header from "../components/Header.vue";
import Spacing from "../components/Spacing.vue";
import RecentlyPlayed from "../components/RecentlyPlayed.vue";
import PlacesNearby from "../components/PlacesNearby.vue";

import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

import Store from "../store";
import TrackStore from "../store/track.js";

import gsap from "gsap";

import {
  playCircleOutline,
  playOutline,
  pauseOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "Home",
  data() {
    return {
      modal: false,
      gesture: null,
      playDistance: 2000,
      footerPos: -64,
      landschaftBottom: null,
      icons: {
        playCircleOutline,
        playSkipBackOutline,
        playOutline,
        pauseOutline,
        playSkipForwardOutline,
        arrowBackOutline,
      },
    };
  },

  mounted() {
    this.store.setPages();

    setInterval(() => {
      this.store.setPages();
      console.log("fetching pages");
    }, 10000);

    SplashScreen.hide();

    this.animateFooter(true);
  },
  computed: {
    headerHeight() {
      let header = document.getElementById("header");
      return header.offsetHeight;
    },
    store() {
      return Store();
    },
    TrackStore() {
      return TrackStore();
    },
    track() {
      return TrackStore().track.value;
    },
    autoplay() {
      return TrackStore().autoplay.value;
    },
    initLoad() {
      return Store().initLoad.value;
    },
    autoplayIcon() {
      if (this.autoplay) {
        return this.icons.pauseOutline;
      } else {
        return this.icons.playOutline;
      }
    },
  },
  watch: {
    modal(val) {
      if (val) {
        this.animateFooter(false);
        this.animateModal(true);
      } else {
        this.animateModal(false);
        this.animateFooter(true);
      }
    },
  },
  methods: {
    setPlayDistance() {
      console.log(this.playDistance);
      this.TrackStore.setPlayDistance(this.playDistance);
    },
    print() {
      console.log("print");
    },
    animateFooter(up) {
      let value = up ? 0 : -64;
      gsap.to("#footer", {
        "margin-bottom": value + "px",
        duration: 0.2,
        ease: "Power3.easeInOut",
      });
    },
    animateModal(up) {
      let value = up ? 0 : 100;
      gsap.to("#modal", {
        "margin-top": value,
        duration: 0.4,
        ease: "Power3.easeInOut",
      });
    },
  },
  components: {
    IonPage,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    Modal,
    Header,
    PlacesNearby,
    RecentlyPlayed,
    PlayerFooter,
    Spacing,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}
</style>
