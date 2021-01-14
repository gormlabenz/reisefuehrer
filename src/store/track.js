import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
//import { Media } from "@ionic-native/media";

const state = reactive({
  settedTrack: null,
  trackLoading: false,
  autoplay: false,
  isPlaying: false,
  serverUrl: "http://192.168.1.5:5000",
});

export default function TrackStore() {
  /* Data */
  async function setTrack(pageID) {
    console.log("track", Store().pages.value[pageID]);
    state.settedTrack = Store().pages.value[pageID];
  }

  async function toggleAutoplay() {
    state.autoplay = !state.autoplay;
  }

  async function setIsPlaying(bool) {
    state.isPlaying = bool;
  }

  const track = computed(() => {
    if (!state.settedTrack) {
      if (!Store().nearestPage.value) {
        return null;
      }
      return Store().nearestPage.value;
    } else {
      return state.settedTrack;
    }
  });

  /* Player Data */

  function toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i >= 0)
      .join(":");
  }

  /* Fetch Track */

  async function fetchTrack() {
    const data = JSON.stringify(track.value);
    state.trackLoading = true;
    axios({
      method: "post",
      url: state.serverUrl,
      data,
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        state.trackLoading = false;
      });
  }

  /* Audio Controlls */

  return {
    track,
    setTrack,
    toggleAutoplay,
    fetchTrack,
    toHHMMSS,
    setIsPlaying,
    trackLoading: computed(() => state.trackLoading),
    duration: computed(() => state.duration),
    serverUrl: computed(() => state.serverUrl),
    autoplay: computed(() => state.autoplay),
    isPlaying: computed(() => state.isPlaying),
  };
}
