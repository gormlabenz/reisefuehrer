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
          <ion-title size="large">Play Now</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row class="ion-justify-content-between ion-align-items-start">
          <ion-col size="8" class="ion-margin-start">
            <ion-text>
              <h1>Autoplay</h1>
              <p>
                Whenever you come across a point of interest, an interisting
                audio clip is playing.
              </p>
            </ion-text>
          </ion-col>

          <ion-col size="3" class="ion-margin-top ion-text-end">
            <div style="width: 100%"></div>
            <ion-button shape="round" size="large" fill="clear">
              <ion-icon
                class="large-icon"
                size="large"
                slot="icon-only"
                :icon="icons.playCircleOutline"
              ></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div style="margin-top: -55px;" id="landschaft"></div>

      <ion-toolbar class="bottom-divider">
        <ion-text>
          <h1 class="ion-margin-start">Places Nearby</h1>
        </ion-text>
      </ion-toolbar>

      <ion-grid>
        <ion-row
          class="ion-nowrap ion-align-items-start"
          style="overflow-x: scroll;"
        >
          <ion-col v-for="(page, index) in pages" :key="index">
            <card-big :img="page.mainImage.thumb">
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{
                truncate(page.summary, 64, true)
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
            <card-small :img="page.mainImage.thumb">
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{ page.summary }}</template>
            </card-small>
            <card-small :img="page.mainImage.thumb">
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{ page.summary }}</template>
            </card-small>
            <card-small :img="page.mainImage.thumb">
              <template v-slot:subtitle>{{ page.dist + "M" }}</template>
              <template v-slot:title>{{
                page.title.replace(/\(.*?\)/, "")
              }}</template>
              <template v-slot:content>{{ page.summary }}</template>
            </card-small>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!-- 
      <div>
        <div class="ion-margin">
          <ion-grid v-if="position">
            <ion-row>
              <ion-col>
                <ion-card-subtitle>Latitude</ion-card-subtitle>
                <ion-card-title>{{
                  position.latitude.toFixed(3)
                }}</ion-card-title>
              </ion-col>
              <ion-col>
                <ion-card-subtitle>Longitude</ion-card-subtitle>
                <ion-card-title>{{
                  position.longitude.toFixed(3)
                }}</ion-card-title>
              </ion-col>
            </ion-row>
          </ion-grid>
  
          <ion-text color="primary">
            <h4>Debugging</h4>
          </ion-text>
          <ion-button @click="print" color="secondary">Print</ion-button>
        </div>
  
        <ion-item>
          <ion-text color="primary">
            <h4>Reading Speed</h4>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-range
            v-model="readingSpeed"
            @click="print"
            min="100"
            max="200"
            color="secondary"
          >
            <ion-label slot="start">0</ion-label>
            <ion-label slot="end">1</ion-label>
          </ion-range>
        </ion-item>
  
        <div id="container">
          <ion-card
            v-for="(page, index) in pages"
            :key="index"
            style="text-align: left"
          >
            <div style="width: 100%; display: block">
              <div style="margin: 16px; position:absolute">
                <ion-button @click="store.getData(page)" color="medium"
                  >Request</ion-button
                >
                <ion-button @click="speak(page.summary)" color="secondary"
                  >Play</ion-button
                >
              </div>
              <img style="width: 100%" :src="page.mainImage.thumb" alt="" />
              <ion-progress-bar
                v-if="page.loading"
                type="indeterminate"
              ></ion-progress-bar>
              <audio controls>
                <source
                  :src="'http://localhost:8000/storys/' + page.pageID + '.wav'"
                  type="audio/wav"
                />
                Your browser does not support the audio element.
              </audio> 
            </div>
            <ion-card-header>
              <ion-card-subtitle>{{ page.dist }} M</ion-card-subtitle>
              <ion-card-title>{{ page.title }}</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              {{ page.summary }}
            </ion-card-content>
          </ion-card>
        </div>
      </div>
       -->
    </ion-content>

    <ion-modal :is-open="modal" css-class="my-custom-class">
      <Modal :swipe-to-close="true" @dismissed-model="modal = false"></Modal>
    </ion-modal>

    <ion-footer @click="modal = true">
      <ion-toolbar>
        <ion-buttons class="small-icon " slot="end">
          <ion-button shape="round" size="large" fill="clear">
            <ion-icon
              class="small-icon"
              size="large"
              slot="icon-only"
              :icon="icons.playSkipBackOutline"
            ></ion-icon>
          </ion-button>

          <ion-button shape="round" size="large" fill="clear">
            <ion-icon
              size="large"
              slot="icon-only"
              :icon="icons.playOutline"
            ></ion-icon>
          </ion-button>
          <ion-button shape="round" size="large" fill="clear">
            <ion-icon
              size="large"
              slot="icon-only"
              :icon="icons.playSkipForwardOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-img
            class="ion-margin-start"
            style="width:36px; height:36px"
            src="https://wikipedia.org/wiki/Special:Redirect/file/U-Bahnhof_Gro%C3%9Fhansdorf_4.jpg?width=300"
          ></ion-img
        ></ion-buttons>
        <ion-title>Tempelhof</ion-title>
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
      modal: false,
      landschaft: null,
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
    pages() {
      return Store().pages.value;
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
      this.landschaft.goToAndStop(scrollPos * 50);
    },
  },
  components: {
    IonContent,
    IonButton,
    IonButtons,
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
  font-size: 64px;
}

.bottom-divider {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: var(--ion-color-light-shade);
}

.small-icon {
  --ionicon-stroke-width: 36px;
}

.large-icon {
  --ionicon-stroke-width: 14px;
  zoom: 2;
}
</style>
