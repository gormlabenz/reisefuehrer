<template>
  <div
    id="header"
    slot="fixed"
    style="background-color: var(--ion-color-secondary); width:100%; z-index:-100"
  >
    <ion-toolbar color="secondary" style="z-index: 0; margin-top: 64px">
      <ion-title
        color="tertiary"
        style="color: var(--ion-color-tertiary);  position: static; line-height: 1.2"
        size="large"
        >Welcome <br />
        on Board!</ion-title
      >
      <ion-text color="teritary">
        <p
          id="text"
          class="ion-margin-start"
          style=" color: var(--ion-color-tertiary)"
        >
          Explore interesting places around you, <br />
          or let the autoplay mode accompany <br />
          you on your journey.
        </p>
      </ion-text>
    </ion-toolbar>

    <div
      style="width: 80%; max-width: 380px; padding: -25px; margin-left: auto;  overflow: visible; margin-top: -64px"
      id="landschaft"
    ></div>

    <div
      style="background-color: var(--ion-color-danger);
    height: 100em;
    margin-top: -4.5px;"
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

<style>
ion-toggle {
  pointer-events: auto;
  z-index: 200;
  position: relative;
}
</style>
