<template>
  <div
    id="lists"
    ref="gesture"
    style="z-index:10; background-color: var(--ion-toolbar-background); border-radius: 16px 16px 0 0; width: 100%; overflow: hidden; height: calc(100vh -80px)"
  >
    <div
      ref="icon"
      style="width:40px; height: 3px; background-color: var(--ion-color-primary); margin-left: auto; margin-right: auto; margin-top: 8px; border-radius: 1.5px"
    ></div>
    <div
      style="overflow-y: scroll; height: 90vh; scroll-snap-type: y mandatory"
    >
      <div style="scroll-snap-align: start;">
        <ion-toolbar style="border-radius: 32px; margin-top: 0px">
          <ion-text>
            <h1 class="ion-margin-start" style="margin-top: 8px">
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

      <div style="scroll-snap-align: start;">
        <ion-toolbar style="margin-top: -32px">
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
    </div>
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
import CardSmall from "../components/CardSmall.vue";

import Store from "../store";
import TextStore from "../store/text.js";
import TrackStore from "../store/track.js";

import { removeOutline } from "ionicons/icons";

export default {
  data() {
    return {
      removeOutline,
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
    TrackStore() {
      return TrackStore();
    },
    pages() {
      return Store().sortedPages.value;
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
    CardSmall,
  },
};
</script>

<style></style>
