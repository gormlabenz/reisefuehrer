<template>
  <div
    style="scroll-snap-align: start; background-color: var(--ion-toolbar-background);"
  >
    <ion-toolbar>
      <ion-text>
        <h1 class="ion-margin-start">
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
              TextStore.truncateAndClamps(page.title, 15, false)
            }}</template>
            <template v-slot:content>{{
              TextStore.truncate(page.summary, 54, true)
            }}</template>
          </card-big>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script>
import {
  IonButton,
  IonIcon,
  IonToolbar,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import CardBig from "../components/CardBig.vue";

import Store from "../store";
import TextStore from "../store/text.js";
import TrackStore from "../store/track.js";

export default {
  data() {
    return {
      icon: null,
    };
  },
  mounted() {
    this.icon = this.$refs.icon;
  },
  methods: {
    setAndOpenModal(index) {
      this.TrackStore.setCurrentPageIndex(index);
      this.$emit("modal");
    },
    setAndPlayTrack(index) {
      this.TrackStore.setCurrentPageIndex(index);
      this.TrackStore.play();
    },
  },
  computed: {
    TextStore() {
      return TextStore();
    },
    pages() {
      return Store().sortedPages.value;
    },
    TrackStore() {
      return TrackStore();
    },
  },
  components: {
    IonButton,
    IonIcon,
    IonToolbar,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    CardBig,
  },
};
</script>

<style></style>
