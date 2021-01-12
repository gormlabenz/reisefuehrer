import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";

const state = reactive({
  settedTrack: null,
  trackLoading: false,
  audio: null,
  serverUrl: "http://192.168.1.5:5000",
});

export default function TrackStore() {
  /* Data */
  async function setTrack(pageID) {
    state.settedTrack = Store().pages.value[pageID];
    console.log("track", Store().pages.value[pageID]);
  }

  async function setAudio(audio) {
    state.audio = audio;
  }

  const audioPlaying = computed(() => {
    if (state.audio) {
      if (!state.audio.paused) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

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

  /* Fetch Track */

  async function fetchTrack() {
    const data = JSON.stringify(track.value);
    state.trackLoading = true;
    console.log("Data", data);
    axios({
      method: "post",
      url: state.serverUrl,
      data,
    })
      .then(
        (response) => {
          console.log(response);
          //const link = "http://localhost:5000/storys/" + track.pageID + ".wav";
        },
        (error) => {
          console.log(error);
        }
      )
      .finally(() => {
        state.trackLoading = false;
      });
  }

  /* Audio Controlls */

  async function play(document) {
    if (!state.audio) {
      var audio = document.createElement("audio");
      setAudio(audio);
    }
    state.audio.setAttribute(
      "src",
      state.serverUrl + "/storys/" + track.value.pageID + ".wav"
    );
    fetchTrack().then(() => {
      state.audio.play().then;
    });
  }

  async function pause() {
    state.audio.pause();
  }

  return {
    track,
    setTrack,
    play,
    pause,
    fetchTrack,
    audioPlaying,
    trackLoading: computed(() => state.trackLoading),
    audio: computed(() => state.audio),
    serverUrl: computed(() => state.serverUrl),
  };
}
