<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nearby</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="pages">
      <ion-header class="ion-no-border" collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nearby</ion-title>
        </ion-toolbar>
      </ion-header>

      <div style="margin: 16px">
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
            <!-- <audio controls>
              <source
                :src="'http://localhost:8000/storys/' + page.pageID + '.wav'"
                type="audio/wav"
              />
              Your browser does not support the audio element.
            </audio> -->
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
    </ion-content>
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
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
  IonRange,
  IonLabel,
  IonProgressBar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Store from "../store";

import { TextToSpeech } from "@ionic-native/text-to-speech";

export default defineComponent({
  name: "Home",
  data() {
    return {
      readingSpeed: "",
    };
  },
  mounted() {
    this.store.setPages();
  },
  computed: {
    store() {
      return Store();
    },
    pages() {
      return Store().pages.value;
      /*       let items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
      });
      items.sort(function(first, second) {
        return second[1].dist - first[1].dist;
      });

      const sorted_dict = {};

      items.forEach((item) => (sorted_dict[item[0]] = item[1]));

      return sorted_dict; */
    },
    position() {
      return Store().position.value;
    },
  },
  methods: {
    speak(text) {
      TextToSpeech.speak({
        text: text,
        locale: "en-GB",
        rate: this.readingSpeed / 100,
      })
        .then(() => console.log("Success Speach"))
        .catch((reason) => console.log(reason));
    },
    print() {
      console.log(Store().pages.value);
    },
  },
  components: {
    IonContent,
    IonButton,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonItem,
    IonRange,
    IonLabel,
    IonProgressBar,
  },
});
</script>

<style scoped>
#container {
  position: relative;
  left: 0;
  right: 0;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
