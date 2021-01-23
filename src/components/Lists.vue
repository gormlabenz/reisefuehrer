<template>
  <div
    id="lists"
    ref="gesture"
    style="z-index:10; background-color: var(--ion-toolbar-background); border-radius: 16px 16px 0 0; width: 100%;  overflow: hidden; margin-top: 100vh; position: fixed"
  >
    <div
      ref="icon"
      style="width:40px; height: 3px; background-color: var(--ion-color-primary); margin-left: auto; margin-right: auto; margin-top: 16px; border-radius: 1.5px"
    ></div>
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
    <div
      style="height: 100em; background-color: var(--ion-toolbar-background)"
    ></div>
    <!-- 
    
   <ion-toolbar class="bottom-divider">
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

import { removeOutline } from "ionicons/icons";
import { createGesture } from "@ionic/core";

import gsap from "gsap";

export default {
  data() {
    return {
      listsPos: { small: 54, big: null, current: 54 },
      removeOutline,
      icon: null,
      lists: null,
    };
  },
  mounted() {
    this.lists = this.$refs.gesture;
    this.icon = this.$refs.icon;
    this.landschaftBottom =
      document.getElementById("landschaft").getBoundingClientRect().bottom - 16;
    this.animateLists(this.landschaftBottom);
    this.gestureFunc();
  },
  methods: {
    async gestureFunc() {
      const gestureOptions = {
        el: this.lists,
        gestureName: "swipe",
        direction: "y",
        onStart: () => {},
        onMove: (ev) => {
          this.icon.style.transform = "scaleX(" + ev.deltaY / 50 + ")";
        },
        onEnd: (ev) => {
          if (Math.abs(ev.startY - ev.currentY) > 100) {
            this.toggleLists();
          } else {
            this.animateLists(this.landschaftBottom);
          }
          this.icon.style.transform = "scaleX(1)";
        },
      };

      const gesture = await createGesture(gestureOptions);
      gesture.enable();
    },
    animateLists(value) {
      gsap.to(this.lists, {
        "margin-top": value + "px",
        duration: 0.6,
        ease: "Power3.easeInOut",
      });
    },
    toggleLists() {
      this.animateLists(this.listsPos.current);
      this.listsPos.current =
        this.listsPos.current > 54 ? 54 : this.landschaftBottom;
    },
    setAndOpenModal(index) {
      this.TrackStore.setCurrentPageIndex(index);
      this.modal = true;
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
