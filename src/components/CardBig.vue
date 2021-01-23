<template>
  <ion-card style="margin-right: 0px; scroll-snap-align: start;">
    <ion-img
      v-show="didLoad"
      :onIonImgDidLoad="imgDidLoad()"
      @click="$emit('click-image')"
      :src="img"
    ></ion-img>
    <img v-show="!didLoad" src="../assets/default_image.png" alt="" />

    <div class="ion-padding" @click="$emit('click-text')">
      <div>
        <div style="display:inline-block">
          <ion-card-subtitle><slot name="subtitle"></slot></ion-card-subtitle>
          <div class="block"></div>
        </div>
        <ion-card-title class="ion-text-nowrap" style="text-overflow: ellipsis;"
          ><slot name="title"></slot
        ></ion-card-title>
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
  data() {
    return { didLoad: false };
  },
  methods: {
    imgDidLoad() {
      this.didLoad = true;
      console.log("fimgDidLoad;");
    },
  },
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
