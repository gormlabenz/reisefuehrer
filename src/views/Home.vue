<template>
  <ion-page>
    <ion-content style="--ion-background-color: none" :fullscreen="true">
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
        style="overflow: scroll; height: 100vh; scroll-snap-type: y mandatory;"
      >
        <div
          style="scroll-snap-align: start; height: 50vh; position: relative;"
        ></div>
        <Lists
          style="scroll-snap-align: end; position: relative;"
          v-if="initLoad"
          @modal="modal = true"
        ></Lists>
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
import Lists from "../components/Lists.vue";

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
      listsPos: {
        up: { marginTop: 0, borderRadius: 0, marginIcon: 32 },
        down: { marginTop: null, borderRadius: 16, marginIcon: 16 },
        current: { marginTop: 0, borderRadius: 0, marginIcon: 32 },
      },
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
    this.listsPos.down.marginTop =
      document.getElementById("landschaft").getBoundingClientRect().bottom - 16;

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
    Lists,
    PlayerFooter,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}
</style>
