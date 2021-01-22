<template>
  <div
    id="header"
    slot="fixed"
    style="background-color: var(--ion-color-secondary); width:100%; z-index:-10"
  >
    <ion-toolbar color="secondary" style="z-index: 0; margin-top: 32px">
      <ion-title
        color="tertiary"
        style="color: var(--ion-color-tertiary);  position: static; line-height: 1.2"
        size="large"
        >Welcome <br />
        on Board!</ion-title
      >
      <ion-text color="teritary">
        <p class="ion-margin-start" style=" color: var(--ion-color-tertiary)">
          Turn on Autoplay, and whenever you <br />
          come across a point of interest, <br />
          an audio track is played.
        </p>
      </ion-text>
    </ion-toolbar>

    <!-- <div
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
    </div> -->

    <div
      style="width: 80%; max-width: 380px; padding: -25px; margin-left: auto;  overflow: visible; margin-top: -64px"
      id="landschaft"
    ></div>
    <div
      style="color: var(--ion-color-danger); height: 100em; border-top: 1px solid #ccc; margin-top: -5px"
    ></div>
  </div>
</template>

<script>
import { IonToolbar, IonTitle, IonText, IonRange, IonNote } from "@ionic/vue";
import landschaft from "../assets/landschaft.json";
import lottie from "lottie-web";

export default {
  data() {
    return {
      landschaft: null,
    };
  },
  mounted() {
    this.landschaft = lottie.loadAnimation({
      container: document.getElementById("landschaft"), // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: landschaft, // the path to the animation json
    });
  },
  components: { IonToolbar, IonTitle, IonText, IonRange, IonNote },
};
</script>

<style></style>
