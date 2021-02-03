import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

import Store from "./store";
let store = Store();

import TrackStore from "./store/track.js";
let trackStore = TrackStore();

const { ScreenOrientation } = require("@ionic-native/screen-orientation");

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/typography.css";
import "./theme/core.css";

/* mount App */
const app = createApp(App)
  .use(IonicVue)
  .use(router);

app.directive("scroll", {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f);
      }
    };
    window.addEventListener("scroll", f);
  },
});

router.isReady().then(() => {
  app.mount("#app");
  store.setPages();
  trackStore.setAutoplayTrack();
  ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
  setInterval(() => {
    trackStore.setAutoplayTrack();
    store.setPages();
    console.log("set Autplay");
  }, 10000);
});
