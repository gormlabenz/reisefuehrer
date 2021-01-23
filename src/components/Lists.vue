<template>
  <div
    id="lists"
    ref="gesture"
    style="z-index:10; background-color: var(--ion-toolbar-background); border-radius: 16px 16px 0 0; width: 100%;  overflow: hidden; margin-top: 100vh;"
  >
    <ion-button
      style="width: 100%; margin: 0"
      shape="round"
      fill="clear"
      @click="toggleLists"
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
    <!-- 
    <div
      style="height: 100em; background-color: var(--ion-toolbar-background)"
    ></div>
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

import { chevronUpOutline, chevronDownOutline } from "ionicons/icons";
import { createGesture } from "@ionic/core";

import gsap from "gsap";

export default {
  data() {
    return {
      listsPos: { small: 54, big: null, current: 54 },
      up: false,
      lists: null,
    };
  },
  mounted() {
    this.lists = this.$refs.gesture;
    this.landschaftBottom =
      document.getElementById("landschaft").getBoundingClientRect().bottom - 16;
    console.log(this.landschaftBottom);
    this.animateLists(this.landschaftBottom);
    this.gestureFunc();
  },
  methods: {
    async gestureFunc() {
      const gestureOptions = {
        el: this.lists,
        gestureName: "swipe",
        direction: "y",
        onStart: () => {
          console.log("onStart");
          // do something as the gesture begins
        },
        onMove: (ev) => {
          // do something in response to movement
          if (Math.abs(ev.startY - ev.currentY) > 100) {
            return;
          }
          console.log("onMove", ev);
          this.lists.style.transform = "translateY(" + ev.deltaY + "px)";
        },
        onEnd: (ev) => {
          // do something when the gesture ends
          console.log("onEnd", ev);
          if (Math.abs(ev.startY - ev.currentY) > 100) {
            this.toggleLists();
          } else {
            this.animateLists(this.landschaftBottom);
          }
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
      console.log("listsPos this.landschaftBottom", this.landschaftBottom);
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
