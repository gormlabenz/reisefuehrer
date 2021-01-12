<template>
  <ion-card class="container ion-margin-bottom">
    <div @click="$emit('click-image')">
      <ion-img :src="img"></ion-img>
    </div>

    <div @click="$emit('click-text')" class="ion-margin-horizontal">
      <div style="display:inline-block">
        <ion-card-subtitle><slot name="subtitle"></slot></ion-card-subtitle>
        <div class="block"></div>
      </div>
      <ion-card-title class="ion-text-nowrap" style="text-overflow: ellipsis;"
        ><slot name="title"></slot
      ></ion-card-title>
      <slot name="content"></slot>
    </div>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonImg,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { TextStore } from "../store/text.js";

export default {
  props: { img: String },
  computed: {
    TextStore() {
      return TextStore();
    },
  },
  components: {
    IonCard,
    IonImg,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
  },
};
</script>

<style scoped>
ion-img {
  height: 125px;
  width: 125px;
  flex-shrink: 0;
}

.container {
  width: 350px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-shrink: 0;
}
</style>
