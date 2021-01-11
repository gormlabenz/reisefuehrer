<template>
  <ion-card class="container">
    <ion-img :src="img"></ion-img>

    <div>
      <ion-card-header>
        <div style="display:inline-block">
          <ion-card-subtitle><slot name="subtitle"></slot></ion-card-subtitle>
          <div class="block"></div>
        </div>
        <ion-card-title><slot name="title"></slot></ion-card-title>
      </ion-card-header>
      <!-- <ion-card-content>
        <slot name="content"></slot>
      </ion-card-content> -->
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

export default {
  props: { img: String },
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
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-shrink: 0;
}
</style>
