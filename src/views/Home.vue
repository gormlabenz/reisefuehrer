<template>
  <ion-page v-if="!modal">
    <ion-content
      style="--ion-background-color: none"
      :fullscreen="true"
      :scroll-events="true"
      @ionScroll="setScrollPos($event.detail.scrollTop)"
    >
      <ion-fab
        vertical="top"
        horizontal="end"
        slot="fixed"
        style="margin-top: 20px"
      >
        <ion-fab-button @click="TrackStore.toggleAutoplay()">
          <ion-icon color="light" :icon="autoplayIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <Header></Header>

      <Lists
        id="lists"
        :on-release="print"
        @animateLists="animateLists"
      ></Lists>
    </ion-content>

    <PlayerFooter v-if="track" @modal="modal = true"></PlayerFooter>
  </ion-page>

  <Modal id="modal" v-if="modal" @dismissed-model="modal = false"> </Modal>
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
import TextStore from "../store/text.js";

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
      lists: { small: 54, big: null, current: 54 },
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
  watch: {
    initLoad() {
      var el = document.getElementById("landschaft"); //record the elem so you don't crawl the DOM everytime
      var landschaftBottom = el.getBoundingClientRect().bottom - 16;
      console.log("animateListsInit", landschaftBottom);
      gsap.to("#lists", {
        "margin-top": landschaftBottom + "px",
        duration: 0.6,
        ease: "Power3.easeInOut",
      });
    },
  },
  mounted() {
    this.store.setPages().then(() => {
      this.initLoad = true;
    });

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
    TextStore() {
      return TextStore();
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
    setScrollPos(pos) {
      this.pos = pos;
    },
    animateLists() {
      var el = document.getElementById("landschaft"); //record the elem so you don't crawl the DOM everytime
      var landschaftBottom = el.getBoundingClientRect().bottom - 16;

      gsap.to("#lists", {
        "margin-top": this.lists.current,
        duration: 0.6,
        ease: "Power3.easeInOut",
      });
      this.lists.current = this.lists.current > 54 ? 54 : landschaftBottom;
      console.log("lists landschaftBottom", landschaftBottom);
    },
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
