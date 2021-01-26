<template>
  <div
    style="scroll-snap-align: end; background-color: var(--ion-toolbar-background);"
  >
    <ion-toolbar>
      <ion-text>
        <h1 class="ion-margin-start">Recently played</h1>
      </ion-text>
    </ion-toolbar>
    <ion-grid>
      <ion-row
        class="ion-nowrap ion-align-items-start"
        style="overflow-x: scroll;scroll-snap-type: x mandatory;"
      >
        <ion-col
          v-for="(page, index) in pages"
          :key="index"
          style="scroll-snap-align: start;"
        >
          <card-small
            :img="page.mainImage.thumb"
            @click-text="setAndOpenModal(index)"
            @click-image="setAndPlayTrack(index)"
          >
            <template v-slot:subtitle>{{ page.dist + "M" }}</template>
            <template v-slot:title>{{
              page.title.replace(/\(.*?\)/, "")
            }}</template>
            <template v-slot:content>{{
              TextStore.truncate(page.summary, 36, true)
            }}</template>
          </card-small>
          <card-small
            :img="page.mainImage.thumb"
            @click-text="setAndOpenModal(index)"
            @click-image="setAndPlayTrack(index)"
          >
            <template v-slot:subtitle>{{ page.dist + "M" }}</template>
            <template v-slot:title>{{
              page.title.replace(/\(.*?\)/, "")
            }}</template>
            <template v-slot:content>{{
              TextStore.truncate(page.summary, 36, true)
            }}</template>
          </card-small>
          <card-small
            :img="page.mainImage.thumb"
            @click-text="setAndOpenModal(index)"
            @click-image="setAndPlayTrack(index)"
          >
            <template v-slot:subtitle>{{ page.dist + "M" }}</template>
            <template v-slot:title>{{
              page.title.replace(/\(.*?\)/, "")
            }}</template>
            <template v-slot:content>{{
              TextStore.truncate(page.summary, 36, true)
            }}</template>
          </card-small>
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
import CardSmall from "../components/CardSmall.vue";

import Store from "../store";
import TextStore from "../store/text.js";
import TrackStore from "../store/track.js";

export default {
  data() {
    return {};
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
    CardSmall,
  },
};
</script>

<style></style>
