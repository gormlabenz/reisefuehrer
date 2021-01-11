<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="$emit('dismissed-model')">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-img
      src="https://wikipedia.org/wiki/Special:Redirect/file/U-Bahnhof_Gro%C3%9Fhansdorf_4.jpg?width=300"
    ></ion-img>

    <div class="ion-text-center ion-margin-top">
      <ion-progress-bar color="dark" value=".4"></ion-progress-bar>
      <ion-grid>
        <ion-row class="ion-justify-content-between">
          <ion-card-subtitle>0.40</ion-card-subtitle>
          <ion-card-subtitle class="light-text">1.40</ion-card-subtitle>
        </ion-row>
      </ion-grid>
      <ion-button
        class="ion-margin-top"
        shape="round"
        size="large"
        fill="clear"
      >
        <ion-icon
          class="small-icon"
          size="large"
          slot="icon-only"
          :icon="playSkipBackOutline"
        ></ion-icon>
      </ion-button>

      <ion-button shape="round" size="large" fill="clear">
        <ion-icon
          class="large-icon"
          size="large"
          slot="icon-only"
          :icon="playCircleOutline"
        ></ion-icon>
      </ion-button>
      <ion-button shape="round" size="large" fill="clear">
        <ion-icon
          class="small-icon"
          size="large"
          slot="icon-only"
          :icon="playSkipForwardOutline"
        ></ion-icon>
      </ion-button>
    </div>

    <div>
      <h1>Places Nearby</h1>
      <p>
        If you mean the size they actually appear on screen the icons are really
        just a font. Increase the font size on your icon and it will get bigger.
        If you want new and different icons, you can use any svg format icon or
        grab another package of icons grouped as a font like @aluknot suggested.
        The glyphicon set that comes with bootstrap is another popular choice
        http://getbootstrap.com/components/ 1.8k
      </p>
    </div>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonCardSubtitle,
  IonGrid,
  IonRow,
} from "@ionic/vue";

import {
  playCircleOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  arrowBackOutline,
} from "ionicons/icons";

import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    title: { type: String, default: "Super Modal" },
  },
  data() {
    return {
      content: "Content",
      playCircleOutline,
      playSkipBackOutline,
      playSkipForwardOutline,
      arrowBackOutline,
    };
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonImg,
    IonIcon,
    IonProgressBar,
    IonCardSubtitle,
    IonGrid,
    IonRow,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
}

.small-icon {
  --ionicon-stroke-width: 36px;
}

.large-icon {
  --ionicon-stroke-width: 18px;
  zoom: 2;
}

.text-light {
  color: red;
  background-color: turquoise;
}
</style>
