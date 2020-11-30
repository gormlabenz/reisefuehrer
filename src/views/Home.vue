<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nearby</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header class="ion-no-border" collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nearby</ion-title>
        </ion-toolbar>
      </ion-header>

      <div style="margin: 16px">
        <ion-grid v-if="coordinates">
          <ion-row>
            <ion-col>
              <ion-card-subtitle>Latitude</ion-card-subtitle>
              <ion-card-title>{{
                coordinates.latitude.toFixed(3)
              }}</ion-card-title>
            </ion-col>
            <ion-col>
              <ion-card-subtitle>Longitude</ion-card-subtitle>
              <ion-card-title>{{
                coordinates.longitude.toFixed(3)
              }}</ion-card-title>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-button @click="print" color="medium">Nearby</ion-button>
        <ion-button @click="fetchPosition" color="medium"
          >fetchPosition</ion-button
        >
        <ion-button @click="setPages" color="medium">setPages</ion-button>
        <ion-button @click="printPages" color="medium">Print Pages</ion-button>
      </div>

      <div id="container">
        <ion-card
          v-for="(page, index) in wikiPages"
          :key="index"
          style="text-align: left"
        >
          <ion-card-header>
            <ion-card-subtitle>{{ page.dist }} M</ion-card-subtitle>
            <ion-card-title>{{ page.title }}</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Keep close to Nature's heart... and break clear away, once in
            awhile, and climb a mountain or spend a week in the woods. Wash your
            spirit clean.
          </ion-card-content>
        </ion-card>
        <strong>{{ coordinates.latitude }}</strong>
        <strong>{{ coordinates.longitude }}</strong>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;
import Store from "../store";

export default defineComponent({
  name: "Home",
  data() {
    return {
      wikiResults: [],
      wikiTitles: [],
      wikiPages: "",
      geolocation: Geolocation,
      coordinates: "",
      watchCoordinates: "",
    };
  },
  mounted() {},
  computed: {},
  methods: {
    print() {
      console.log(Store().position.value);
    },
    fetchPosition() {
      Store().fetchPosition();
    },
    fetchPages() {
      Store().fetchPages("Batman");
    },
    setPages() {
      Store().setPages();
    },
    printPages() {
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
