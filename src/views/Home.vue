<template>
  <ion-page v-if="!modal">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Listen Now</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :scroll-events="true"
      @ionScroll="stopAndPlay($event.detail.scrollTop)"
      :fullscreen="true"
      v-if="pages"
    >
      <ion-header class="ion-no-border" collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Listen Now</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-fab vertical="top" horizontal="end" slot="fixed">
        <ion-fab-button @click="TrackStore.toggleAutoplay()">
          <ion-icon color="light" :icon="autoplayIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-toolbar>
        <ion-text>
          <h1 class="ion-margin-start">Autoplay</h1>
          <p class="ion-margin-start" style="width: 66%">
            If you pass a place of interest,<br />
            a trek is played.
          </p>
        </ion-text>
      </ion-toolbar>
      <div
        style="background-color: var(--ion-toolbar-background, var(--ion-background-color, #fff));"
        id="landschaft"
      ></div>

      <ion-toolbar class="bottom-divider">
        <ion-text>
          <h1 class="ion-margin-start">Places Nearby</h1>
        </ion-text>
      </ion-toolbar>

      <ion-grid>
        <ion-row
          class="ion-nowrap ion-align-items-start ion-padding-end"
          style="overflow-x: scroll;"
        >
          <ion-col v-for="(page, index) in pages" :key="index">
            <card-big
              :img="page.mainImage.thumb"
              @click-text="setAndOpenModal(index)"
              @click-image="setAndPlayTrack(index)"
            >
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                truncateAndClamps(page.title, 15, false)
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 54, true)
              }}</template>
            </card-big>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- <ion-toolbar class="bottom-divider">
        <ion-text>
          <h1 class="ion-margin-start">Recently played</h1>
        </ion-text>
      </ion-toolbar>
      <ion-grid>
        <ion-row
          class="ion-nowrap ion-align-items-start"
          style="overflow-x: scroll;"
        >
          <ion-col v-for="(page, index) in pages" :key="index">
            <card-small
              :img="page.mainImage.thumb"
              @click-text="setAndOpenModal(page.pageID)"
              @click-image="setAndPlayTrack(page.pageID)"
            >
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 36, true)
              }}</template>
            </card-small>
            <card-small
              :img="page.mainImage.thumb"
              @click-text="setAndOpenModal(page.pageID)"
              @click-image="setAndPlayTrack(page.pageID)"
            >
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 36, true)
              }}</template>
            </card-small>
            <card-small
              :img="page.mainImage.thumb"
              @click-text="setAndOpenModal(page.pageID)"
              @click-image="setAndPlayTrack(page.pageID)"
            >
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 36, true)
              }}</template>
            </card-small>
          </ion-col>
        </ion-row>
      </ion-grid> -->
    </ion-content>
    <ion-spinner v-else class="ion-margin" name="crescent"></ion-spinner>

    <ion-footer v-if="track">
      <ion-progress-bar
        v-if="trackLoading"
        color="dark"
        type="indeterminate"
      ></ion-progress-bar>

      <ion-toolbar class="footer">
        <ion-buttons class="icon-small" slot="end">
          <Player :big="false"></Player>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-img
            @click.self="modal = true"
            class="ion-margin-start"
            style="width:36px; height:36px"
            :src="track.mainImage.thumb"
          ></ion-img
        ></ion-buttons>
        <h4
          @click.self="modal = true"
          class="ion-margin-start"
          style="margin: 0 0 0 16px; position: absolute; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%);"
        >
          {{ trackTitle }}
        </h4>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
  <Modal v-else @dismissed-model="modal = false"> </Modal>
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
} from "@ionic/vue";

import CardBig from "../components/CardBig.vue";
import CardSmall from "../components/CardSmall.vue";
import Modal from "../components/Modal.vue";
import Player from "../components/Player.vue";

import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

import Store from "../store";
import TrackStore from "../store/track.js";

import lottie from "lottie-web";
import landschaft from "../assets/landschaft.json";

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
      landschaft: null,
      modal: false,
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
    SplashScreen.hide();
    /* setInterval(() => {
      if (!this.TrackStore.isPlaying.value) {
      }
    }, 1000); */
    this.landschaft = lottie.loadAnimation({
      container: document.getElementById("landschaft"), // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: false,
      animationData: landschaft, // the path to the animation json
    });
  },
  computed: {
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
    pages() {
      return Store().sortedPages.value;
    },
    position() {
      return Store().position.value;
    },
    trackTitle() {
      return this.truncateAndClamps(this.track.title, 14, false);
    },
  },
  methods: {
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
    truncate(str, n, useWordBoundary) {
      if (str.length <= n) {
        return str;
      }
      const subString = str.substr(0, n - 1); // the original check
      return (
        (useWordBoundary
          ? subString.substr(0, subString.lastIndexOf(" "))
          : subString) + "…"
      );
    },
    truncateAndClamps(str, n, useWordBoundary) {
      let string = str.replace(/\(.*?\)/, "");
      return this.truncate(string, n, useWordBoundary);
    },
    stopAndPlay(scrollPos) {
      if (scrollPos < 0) {
        scrollPos = 0;
      }
      if (scrollPos > 160) {
        scrollPos = 160;
      }
      this.landschaft.goToAndStop(scrollPos * 25);
    },
    setAndOpenModal(index) {
      this.TrackStore.setCurrentPageIndex(index);
      this.modal = true;
      console.log("page index", index);
    },
    setAndPlayTrack(index) {
      this.TrackStore.setCurrentPageIndex(index);
      this.TrackStore.play();
      console.log("page index", index);
    },
    play() {
      this.TrackStore.play();
    },
    pause() {
      this.TrackStore.pause();
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
    CardBig,
    CardSmall,
    Modal,
    Player,
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
</style>
