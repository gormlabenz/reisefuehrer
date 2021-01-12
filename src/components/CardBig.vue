<template>
  <ion-card style="margin-right: 0px">
    <ion-img @click="$emit('click-image')" :src="img"></ion-img>

    <div class="ion-padding" @click="$emit('click-text')">
      <div>
        <div style="display:inline-block">
          <ion-card-subtitle><slot name="subtitle"></slot></ion-card-subtitle>
          <div class="block"></div>
        </div>
        <ion-card-title><slot name="title"></slot></ion-card-title>
      </div>

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
  },
};
</script>

<style scoped>
ion-card {
  width: 250px;
}
ion-img {
  height: 250px;
}

.text {
  max-height: 50px;
}
</style>
