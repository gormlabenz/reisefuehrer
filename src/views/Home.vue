<template>
  <ion-page v-if="!modal">
    <ion-content
      style="--ion-background-color: none"
      :fullscreen="true"
      v-if="pages"
      :scroll-events="true"
      @ionScroll="animateLists"
    >
      <ion-fab
        vertical="top"
        horizontal="end"
        slot="fixed"
        class="ion-margin-top"
      >
        <ion-fab-button @click="TrackStore.toggleAutoplay()">
          <ion-icon color="light" :icon="autoplayIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <div
        id="header"
        slot="fixed"
        style="background-color: var(--ion-color-secondary); width:100%; z-index:-10"
      >
        <ion-toolbar color="secondary" style="z-index: 0; margin-top: 32px">
          <ion-title
            color="tertiary"
            style="color: var(--ion-color-tertiary);  position: static;"
            size="large"
            >Welcome <br />
            on Board!</ion-title
          >
          <ion-text color="teritary">
            <p
              class="ion-margin-start"
              style="width: 66%; color: var(--ion-color-tertiary)"
            >
              Turn on Autoplay, and whenever you come across a point of
              interest, an audio track is played.
            </p>
          </ion-text>
        </ion-toolbar>

        <transition name="fade">
          <div
            class="ion-padding-horizontal"
            style="background-color: var(--ion-color-secondary); margin-top: -24px; padding-bottom: 24px"
            v-if="autoplay"
          >
            <ion-range
              style="padding-inline: 0;"
              v-model="playDistance"
              @ionChange="setPlayDistance"
              min="50"
              max="2000"
              step="40"
              snaps="true"
              ticks="false"
              color="dark"
              :pin="true"
              ><ion-label slot="start">50M</ion-label
              ><ion-label slot="end">2000M</ion-label></ion-range
            >
            <ion-note>
              At how many meters distance should the trek be played.
            </ion-note>
          </div>
        </transition>

        <div
          style="width: 80%; max-width: 380px; margin-left: auto;  overflow: visible; margin-top: -64px;"
          id="landschaft"
        ></div>
      </div>

      <div
        id="lists"
        style="margin-top: 324.9px; z-index:10; background-color: white; border-radius: 35px 35px 0 0; width: 100%"
        v-scroll="animateLists"
        @scroll="animateLists"
      >
        <ion-button
          style="width: 100%"
          shape="round"
          fill="clear"
          v-on:click="animateLists"
        >
          <ion-icon
            style="width: 100%"
            slot="icon-only"
            :icon="listsIcon"
          ></ion-icon>
        </ion-button>

        <ion-toolbar style="border-radius: 35px">
          <ion-text>
            <h1 class="ion-margin-start" style="margin-top: 0">
              Places Nearby
            </h1>
          </ion-text>
        </ion-toolbar>

        <ion-grid>
          <ion-row
            class="ion-nowrap ion-align-items-start ion-padding-end"
            style="overflow-x: scroll; scroll-snap-type: x mandatory; scroll-padding-left: 16px;"
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
      </div>
    </ion-content>

    <ion-footer v-if="track">
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
            @click.self="modal = true"
            class="ion-margin-start"
            style="width:36px; height:36px"
            :src="track.mainImage.thumb"
          ></ion-img
        ></ion-buttons>
        <h4
          @click.self="modal = true"
          class="ion-margin-start"
          style="margin: 0 0 0 16px;"
        >
          {{ trackTitle }}
        </h4>
      </ion-toolbar>
    </ion-footer>
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

import CardBig from "../components/CardBig.vue";
import CardSmall from "../components/CardSmall.vue";
import Modal from "../components/Modal.vue";
import Player from "../components/Player.vue";

import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { SplashScreen } = Plugins;

import Store from "../store";
import TrackStore from "../store/track.js";

import gsap from "gsap";
import lottie from "lottie-web";
import landschaft from "../assets/landschaft.json";

import {
  playCircleOutline,
  playOutline,
  pauseOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
  chevronUpOutline,
  chevronDownOutline,
} from "ionicons/icons";

import { TextToSpeech } from "@ionic-native/text-to-speech";

export default defineComponent({
  name: "Home",
  data() {
    return {
      readingSpeed: "",
      landschaft: null,
      modal: false,
      lists: 32,
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
      console.log("playDistance", this.playDistance);
    }, 10000);

    SplashScreen.hide();

    this.landschaft = lottie.loadAnimation({
      container: document.getElementById("landschaft"), // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: landschaft, // the path to the animation json
    });
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
    autoplayIcon() {
      if (this.autoplay) {
        return this.icons.pauseOutline;
      } else {
        return this.icons.playOutline;
      }
    },
    listsIcon() {
      if (this.lists < 50) {
        return chevronUpOutline;
      } else {
        return chevronDownOutline;
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
    animateLists() {
      gsap.to("#lists", {
        "margin-top": this.lists,
        duration: 0.6,
        ease: "Power3.easeInOut",
      });
      this.lists =
        this.lists == 54 ? this.headerHeight - this.headerHeight * 0.1 : 54;
      console.log("lists", this.lists);
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
      //this.landschaft.goToAndStop(scrollPos * 25);
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
    setPlayDistance() {
      console.log(this.playDistance);
      this.TrackStore.setPlayDistance(this.playDistance);
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
