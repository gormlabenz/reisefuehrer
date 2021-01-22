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
      <Lists v-if="initLoad" @animateLists="animateLists"></Lists>
    </ion-content>

    <PlayerFooter v-if="track" @modal="modal = true"></PlayerFooter>
  </ion-page>
  <transition name="fade">
    <Modal v-if="modal" @dismissed-model="modal = false"> </Modal>
  </transition>
</template>

<script>
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonImg,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
  IonRange,
  IonLabel,
  IonProgressBar,
  IonListHeader,
  IonList,
  IonModal,
  IonSpinner,
  IonNote,
} from "@ionic/vue";

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

import { TextToSpeech } from "@ionic-native/text-to-speech";

export default defineComponent({
  name: "Home",
  data() {
    return {
      readingSpeed: "",

      modal: false,
      lists: { small: 54, big: null, current: 54 },
      initLoad: false,
      pos: 0,
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
    this.store.setPages().then(() => {
      this.initLoad = true;
    });

    setInterval(() => {
      this.store.setPages();
      console.log("fetching pages");
      console.log("playDistance", this.playDistance);
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
    autoplayIcon() {
      if (this.autoplay) {
        return this.icons.pauseOutline;
      } else {
        return this.icons.playOutline;
      }
    },
    audioPlaying() {
      return false;
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
    test(str) {
      return str;
    },
    speak(text) {
      TextToSpeech.speak({
        text: text,
        locale: "en-GB",
        rate: this.readingSpeed / 100,
      })
        .then(() => console.log("Success Speach"))
        .catch((reason) => console.log(reason));
    },

    stopAndPlay(scrollPos) {
      if (scrollPos < 0) {
        scrollPos = 0;
      }
      if (scrollPos > 160) {
        scrollPos = 160;
      }
      //this.landschaft.goToAndStop(scrollPos * 25);
    },
    play() {
      this.TrackStore.play();
    },
    pause() {
      this.TrackStore.pause();
    },
    setPlayDistance() {
      console.log(this.playDistance);
      this.TrackStore.setPlayDistance(this.playDistance);
    },
    print(coneten) {
      console.log(coneten);
    },
  },
  components: {
    IonContent,
    IonButton,
    IonButtons,
    IonFab,
    IonFabButton,
    IonHeader,
    IonFooter,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonIcon,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonItem,
    IonRange,
    IonLabel,
    IonProgressBar,
    IonListHeader,
    IonList,
    IonModal,
    Modal,
    Header,
    Lists,
    PlayerFooter,
    IonSpinner,
    IonNote,
  },
});
</script>

<style scoped>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}

.bottom-divider {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: var(--ion-color-light-shade);
}

.footer {
  --min-height: 64px;
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
