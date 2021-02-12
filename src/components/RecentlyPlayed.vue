<template>
  <div
    v-if="recentlyPlayed"
    style="scroll-snap-align: start; background-color: var(--ion-toolbar-background); padding-bottom: 64px;  min-height: 300px"
  >
    <ion-toolbar>
      <ion-text>
        <h1 class="ion-margin-start">Recently Played</h1>
      </ion-text>
    </ion-toolbar>
    <ion-grid>
      <ion-row
        class="ion-nowrap ion-align-items-start"
        style="overflow-x: scroll;scroll-snap-type: x mandatory;"
      >
        <ion-col
          v-for="(col, index) in recentlyPlayedPagesCols"
          :key="index"
          style="scroll-snap-align: start;"
        >
          <card-small
            v-for="(page, colIndex) in col"
            :key="colIndex"
            :img="page.mainImage.thumb"
            @click-text="setAndOpenModal(index * 3 + colIndex)"
            @click-image="setAndPlayTrack(index * 3 + colIndex)"
            ><p>{{ (index + 1) * colIndex }}</p>
            <template v-slot:subtitle>{{ page.date }}</template>
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
      this.TrackStore.clearMedia();
      this.TrackStore.setSkipThroughRP(true);
      this.$emit("modal");
    },
    setAndPlayTrack(index) {
      this.TrackStore.setSkipThroughRP(true);
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
    recentlyPlayed() {
      if (TrackStore().recentlyPlayed.value) {
        return TrackStore().recentlyPlayed.value.reverse();
      } else {
        return null;
      }
    },
    recentlyPlayedPagesCols() {
      let n;
      let pages = [];
      for (n = 0; n < this.recentlyPlayed.length; n = n + 3) {
        let col = [];
        col.push(this.recentlyPlayed[n]);
        if (this.recentlyPlayed[n + 1]) {
          col.push(this.recentlyPlayed[n + 1]);
        }
        if (this.recentlyPlayed[n + 2]) {
          col.push(this.recentlyPlayed[n + 2]);
        }
        pages.push(col);
      }
      return pages;
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
