<template>
  <div
    style="z-index:10; background-color: var(--ion-toolbar-background); border-radius: 16px 16px 0 0; width: 100%;  overflow: hidden; margin-top: 100vh"
  >
    <ion-button
      style="width: 100%; margin: 0"
      shape="round"
      fill="clear"
      @click="animateLists"
    >
      <ion-icon
        style="width: 100%"
        slot="icon-only"
        :icon="listsIcon"
      ></ion-icon>
    </ion-button>

    <ion-toolbar style="border-radius: 32px; margin-top: 0px">
      <ion-text>
        <h1 class="ion-margin-start" style="margin-top: 0px">
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
    <div
      style="height: 100em; background-color: var(--ion-toolbar-background)"
    ></div>
    <!-- <ion-toolbar class="bottom-divider">
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
                    <template v-slot:content>{{
                      truncate(page.summary, 36, true)
                    }}</template>
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
                    <template v-slot:content>{{
                      truncate(page.summary, 36, true)
                    }}</template>
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
                    <template v-slot:content>{{
                      truncate(page.summary, 36, true)
                    }}</template>
                  </card-small>
                </ion-col>
              </ion-row>
            </ion-grid> -->
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

import { chevronUpOutline, chevronDownOutline } from "ionicons/icons";

export default {
  data() {
    return { lists: { small: 54, big: null, current: 54 }, up: false };
  },
  methods: {
    animateLists() {
      this.$emit("animateLists");
      this.up = !this.up;
    },
    setAndOpenModal(index) {
      console.log("page index", index);
      this.TrackStore.setCurrentPageIndex(index);
      this.modal = true;
    },
    setAndPlayTrack(index) {
      console.log("page index", index);
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
    listsIcon() {
      if (this.up) {
        return chevronDownOutline;
      } else {
        return chevronUpOutline;
      }
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
