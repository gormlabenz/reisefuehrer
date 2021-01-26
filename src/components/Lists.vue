<template>
  <div
    id="lists"
    ref="gesture"
    style="z-index:10; background-color: var(--ion-toolbar-background); border-radius: 16px 16px 0 0; width: 100%; overflow: hidden; height: calc(100vh -80px)"
  >


      
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
