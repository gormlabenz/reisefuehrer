import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
const { Media } = require("@ionic-native/media");

const state = reactive({
  trackLoading: false,
  autoplay: false,
  isPlaying: false,
  serverUrl: "http://192.168.1.5:5000",
  media: null,
  currentPageIndex: 0,
});

export default function TrackStore() {
  /* Data */
  async function setCurrentPageIndex(index) {
    console.log("index", index);
    state.currentPageIndex = index;
  }

  async function toggleAutoplay() {
    state.autoplay = !state.autoplay;
  }

  async function setIsPlaying(bool) {
    state.isPlaying = bool;
  }

  const track = computed(() => {
    if (!Store().sortedPages.value[state.currentPageIndex]) {
      return null;
    } else {
      return Store().sortedPages.value[state.currentPageIndex];
    }
  });

  function addCurrentPageIndex() {
    if (state.currentPageIndex > Store().sortedPages.value.length) {
      state.currentPageIndex = Store().sortedPages.value.length;
    } else {
      state.currentPageIndex = state.currentPageIndex + 1;
    }
  }

  function subtractCurrentPageIndex() {
    if (state.currentPageIndex < 1) {
      state.currentPageIndex = 0;
    } else {
      state.currentPageIndex = state.currentPageIndex - 1;
    }
  }

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

  function fetchTrack() {
    const data = JSON.stringify(track.value);
    state.trackLoading = true;
    axios({
      method: "post",
      url: state.serverUrl,
      data,
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        state.trackLoading = false;
      });
  }

  /* Preload */

  async function play() {
    //let response = fetchTrack();
    console.log(
      "url",
      state.serverUrl + "/storys/" + track.value.pageID + ".mp3"
    );
    state.media = Media.create(
      state.serverUrl + "/storys/" + track.value.pageID + ".mp3"
    );

    state.media.play();
    state.media.onStatusUpdate.subscribe((status) => {
      switch (status) {
        case 1:
          break;
        case 2: // 2: playing
          setIsPlaying(true);
          break;
        case 3: // 3: pause
          setIsPlaying(false);
          break;
        case 4: // 4: stop
        default:
          setIsPlaying(false);
          break;
      }
    });
  }

  /* Audio Controlls */

  function pause() {
    state.media.pause();
  }
  function skip() {
    addCurrentPageIndex();
    console.log("skip", state.currentPageIndex);
  }
  function skipBack() {
    subtractCurrentPageIndex();
  }

  return {
    track,
    setCurrentPageIndex,
    toggleAutoplay,
    fetchTrack,
    toHHMMSS,
    setIsPlaying,
    play,
    pause,
    skip,
    skipBack,
    trackLoading: computed(() => state.trackLoading),
    duration: computed(() => state.duration),
    serverUrl: computed(() => state.serverUrl),
    autoplay: computed(() => state.autoplay),
    isPlaying: computed(() => state.isPlaying),
  };
}