<template>
  <div ref="modal" style="margin-top: 100vh; ">
    <ion-header style="position: fixed">
      <ion-toolbar>
        <ion-title>{{ track.title.replace(/\(.*?\)/, "") }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('dismissed-model')">Close</ion-button>
        </ion-buttons>
        <ion-progress-bar
          v-if="trackLoading"
          color="dark"
          type="indeterminate"
        ></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="position: absolute;">
      <div class="ion-text-center" style="padding-top: 64px;">
        <ion-grid>
          <img :src="track.mainImage.url" />
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <Player :big="true"></Player>
          </ion-row>
          <ion-row class="ion-justify-content-between">
            <h4>Autoplay Settings</h4>
            <ion-button shape="round" fill="clear" @click="toggleSettigs">
              <ion-icon :icon="settingsButton"></ion-icon>
            </ion-button>
          </ion-row>
          <div id="settings" v-if="settings">
            <ion-row>
              <ion-range
                style="padding-inline: 0;"
                @ionChange="setPlayDistance($event)"
                value="975"
                min="50"
                max="2000"
                step="40"
                snaps="true"
                ticks="false"
                color="dark"
                :pin="false"
                ><ion-label style="font-weight: bold;" slot="start"
                  >50 M</ion-label
                ><ion-label style="font-weight: bold;" slot="end"
                  >2 KM</ion-label
                ></ion-range
              ></ion-row
            >
            <ion-row class="ion-text-start">
              <ion-note>
                The distance from which a track should be played automatically.
              </ion-note>
              <ion-text color="danger">
                <p style="font-weight: bold;" color="danger">
                  Keep the app open and the screen unlocked to use Autplay.
                </p>
              </ion-text>
            </ion-row>
          </div>
        </ion-grid>
      </div>

      <div>
        <h1>{{ track.title }}</h1>
        <p>
          {{ track.summary }}
        </p>
      </div>
    </ion-content>
  </div>
</template>

<script>
import TrackStore from "../store/track.js";
import Store from "../store";
import {
  volumeHighOutline,
  volumeMuteOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons";
import Player from "./Player.vue";
import { defineComponent } from "vue";
import { createGesture } from "@ionic/core";
/* import gsap from "gsap"; */

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonText,
  IonNote,
  IonRange,
  IonLabel,
} from "@ionic/vue";

export default defineComponent({
  name: "Modal",
  data() {
    return {
      volumeHighOutline,
      volumeMuteOutline,
      el: null,
      settings: false,
    };
  },
  mounted() {
    this.el = this.$refs.modal;
    this.gestureFunc();
  },
  watch: {
    /*  settings() {
      let value = this.settings ? 100 : 0;
      gsap.to("#settings", {
        height: value + "%",
        duration: 0.2,
        ease: "Power3.easeInOut",
      });
    }, */
  },
  methods: {
    async gestureFunc() {
      const gestureOptions = {
        el: this.el,
        gestureName: "swipe",
        direction: "y",
        onStart: () => {},
        onMove: () => {},
        onEnd: (ev) => {
          if (ev.deltaY > 100) {
            this.$emit("dismissed-model");
          }
        },
      };

      const gesture = await createGesture(gestureOptions);
      gesture.enable();
    },
    setPlayDistance(event) {
      console.log(event.detail.value);
      this.TrackStore.setPlayDistance(event.detail.value);
    },
    toggleSettigs() {
      this.settings = !this.settings;
    },
  },
  computed: {
    TrackStore() {
      return TrackStore();
    },
    trackLoading() {
      return TrackStore().trackLoading.value;
    },
    autoplay() {
      return TrackStore().autoplay.value;
    },
    track() {
      if (TrackStore().track.value) {
        return TrackStore().track.value;
      } else {
        return Store().defaultPage.value;
      }
    },
    settingsButton() {
      if (this.settings) {
        return chevronDownOutline;
      } else {
        return chevronUpOutline;
      }
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonImg,
    IonIcon,
    IonProgressBar,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonText,
    IonNote,
    IonRange,
    IonLabel,
    Player,
  },
});
</script>

<style>
ion-icon {
  color: var(--ion-color-primary);
  --ionicon-stroke-width: 48px;
}
ion-range {
  margin-left: -16px;
  margin-right: -16px;
}
.icon-large {
  zoom: 1.5;
}

.text-light {
  color: red;
  background-color: turquoise;
}

p {
  font-size: 14px;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
</style>
