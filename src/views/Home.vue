<template>
  <ion-page>
    <ion-content style="--ion-background-color: none" :fullscreen="true">
      <ion-fab
        vertical="top"
        horizontal="end"
        slot="fixed"
        style="margin-top: 20px; margin-right: 20px"
      >
        <ion-fab-button @click="TrackStore.toggleAutoplay()">
          <ion-icon color="light" :icon="autoplayIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <Header></Header>

      <Lists v-if="initLoad"></Lists>
    </ion-content>

    <PlayerFooter v-if="track" @modal="modal = true"></PlayerFooter>
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
  methods: {
    setPlayDistance() {
      console.log(this.playDistance);
      this.TrackStore.setPlayDistance(this.playDistance);
    },
    print() {
      console.log("print");
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
