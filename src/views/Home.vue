<template>
  <ion-page>
    <ion-content
      style="--ion-background-color: none"
      :force-overscroll="true"
      :fullscreen="false"
    >
      <Header></Header>
      <div
        v-if="initLoad"
        style="overflow: scroll; height: 100vh; scroll-snap-type: y mandatory;"
      >
        <Spacing></Spacing>
        <StickyHeader></StickyHeader>
        <PlacesNearby @modal="modal = true"></PlacesNearby>
        <RecentlyPlayed @modal="modal = true"></RecentlyPlayed>
      </div>
    </ion-content>

    <PlayerFooter id="footer" @modal="modal = true"></PlayerFooter>
  </ion-page>

  <Modal id="modal" @dismissed-model="modal = false"> </Modal>
  <ErrorToast></ErrorToast>
</template>

<script>
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/vue";

import Modal from "../components/Modal.vue";
import PlayerFooter from "../components/PlayerFooter.vue";
import Header from "../components/Header.vue";
import StickyHeader from "../components/StickyHeader.vue";
import Spacing from "../components/Spacing.vue";
import RecentlyPlayed from "../components/RecentlyPlayed.vue";
import PlacesNearby from "../components/PlacesNearby.vue";
import ErrorToast from "../components/ErrorToast.vue";

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
      textBottom: null,
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
    SplashScreen.hide();

    this.animateFooter(true);
  },
  computed: {
    headerHeight() {
      let header = document.getElementById("header");
      return header.offsetHeight;
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
    initLoad() {
      const el = document.getElementById("text");
      this.textBottom = el.getBoundingClientRect().bottom;
    },
  },
  methods: {
    setTextBottom(val) {
      console.log("textBottom", val);
      this.textBottom = val;
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
    StickyHeader,
    ErrorToast,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}
</style>
