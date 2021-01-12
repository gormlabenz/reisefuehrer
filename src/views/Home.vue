<template>
  <ion-page>
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
        <ion-fab-button>
          <ion-icon color="light" :icon="icons.playOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-toolbar>
        <ion-text>
          <h1 class="ion-margin-start">Autoplay</h1>
          <p class="ion-margin-start" style="width: 66%">
            Whenever you come across a point of interest, an interisting audio
            clip is playing.
          </p>
        </ion-text>
        <div id="landschaft"></div>
      </ion-toolbar>

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
              @click-text="setAndOpenModal(page.pageID)"
              @click-image="setAndPlayTrack(page.pageID)"
            >
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 54, true)
              }}</template>
            </card-big>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-toolbar class="bottom-divider">
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
              <template v-slot:content>{{ page.summary }}</template>
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
              <template v-slot:content>{{ page.summary }}</template>
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
              <template v-slot:content>{{ page.summary }}</template>
            </card-small>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-modal :is-open="modal" css-class="my-custom-class">
      <Modal :swipe-to-close="true" @dismissed-model="modal = false"> </Modal>
    </ion-modal>

    <ion-footer v-if="track" @click="modal = true">
      <ion-progress-bar
        v-if="trackLoading"
        color="dark"
        type="indeterminate"
      ></ion-progress-bar>
      <ion-progress-bar v-else color="dark" value=".4"></ion-progress-bar>

      <ion-toolbar class="footer">
        <ion-buttons class="icon-small" slot="end">
          <ion-button shape="round" fill="clear">
            <ion-icon
              slot="icon-only"
              :icon="icons.playSkipBackOutline"
            ></ion-icon>
          </ion-button>

          <ion-button shape="round" fill="clear" @click="play">
            <ion-icon slot="icon-only" :icon="icons.playOutline"></ion-icon>
          </ion-button>
          <ion-button shape="round" fill="clear">
            <ion-icon
              slot="icon-only"
              :icon="icons.playSkipForwardOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-img
            class="ion-margin-start"
            style="width:36px; height:36px"
            :src="track.mainImage.thumb"
          ></ion-img
        ></ion-buttons>
        <ion-title slot="start">{{
          track.title.replace(/\(.*?\)/, "")
        }}</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
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

import { defineComponent } from "vue";
import Store from "../store";
import TrackStore from "../store/track.js";

import lottie from "lottie-web";
import landschaft from "../assets/landschaft.json";

import {
  playCircleOutline,
  playOutline,
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
        playSkipForwardOutline,
        arrowBackOutline,
      },
    };
  },
  mounted() {
    this.store.setPages();
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
    trackStore() {
      return TrackStore();
    },
    trackLoading() {
      return TrackStore().trackLoading.value;
    },
    track() {
      return TrackStore().track.value;
    },
    serverUrl() {
      return TrackStore().serverUrl.value;
    },
    pages() {
      return Store().sortedPages.value;
    },
    position() {
      return Store().position.value;
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
    print() {
      console.log(this.scrollY);
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
    setAndOpenModal(pageID) {
      this.trackStore.setTrack(pageID);
      this.modal = true;
    },
    setAndPlayTrack(pageID) {
      this.trackStore.setTrack(pageID);
    },
    play() {
      var myAudio = document.createElement("audio");
      console.log(this.serverUrl + "/storys/" + this.track.pageID + ".wav");
      myAudio.setAttribute(
        "src",
        this.serverUrl + "/storys/" + this.track.pageID + ".wav"
      );

      this.trackStore.play(myAudio);
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
  },
});
</script>

<style scoped>
ion-icon {
  color: var(--ion-color-primary);
}

.bottom-divider {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: var(--ion-color-light-shade);
}

ion-icon {
  --ionicon-stroke-width: 48px;
}

.footer {
  --min-height: 64px;
  --border-style: none;
}
</style>
