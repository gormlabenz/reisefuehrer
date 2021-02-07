<template><div></div> </template>

<script>
import Store from "../store";
import TrackStore from "../store/track.js";

import { toastController } from "@ionic/vue";

export default {
  computed: {
    positionError() {
      return Store().positionError.value;
    },
    fetchLong() {
      return TrackStore().fetchLong.value;
    },
  },
  watch: {
    async positionError() {
      console.log("position Error", this.positionError);
      if (this.positionError) {
        const toast = await toastController.create({
          message:
            "Sorry for the interruption, but you must make sure in the settings that your coordinates can be used and that you have network.",
          duration: 10000,
          position: "top",
          color: "danger",
          header: "Enable Geolocation",
        });
        return toast.present();
      }
    },
    async fetchLong() {
      console.log("Fetch long", this.fetchLong);
      if (this.fetchLong) {
        const toast = await toastController.create({
          message:
            "Oops, the loading seems to take a little longer this time. Don't worry, this means that many are enjoying Triptalk at the moment. It should take no longer than a minute until the track is loaded.",
          duration: 10000,
          position: "top",
          color: "danger",
          header: "Loading Time",
        });
        return toast.present();
      }
    },
  },
};
</script>

<style></style>
