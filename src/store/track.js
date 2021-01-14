import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
import { Media } from "@ionic-native/media";

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
  /* async function setDuration(duration) {
    state.duration = duration;
  } */

  const audioPlaying = computed(() => {});

  const audioDuration = computed(() => {});

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
      .then((response) => {
        console.log("response", response.data);
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

  async function play() {
    fetchTrack().then((response) => {
      console.log(response.data);
      const audio = Media.create(
        state.serverUrl + "/storys/" + track.value.pageID + ".mp3",
        // succes callback
        function() {
          console.log("playAudio():Audio Success");
        },
        // error callback
        function(err) {
          console.log("playAudio():Audio Error: " + err);
        }
      );
      console.log(audio);
      setAudio(audio);
      audio.play();
      console.log("set audio");
    });
  }

  async function pause() {}

  return {
    track,
    setTrack,
    play,
    pause,
    fetchTrack,
    audioPlaying,
    audioDuration,
    //audioPos,
    trackLoading: computed(() => state.trackLoading),
    audio: computed(() => state.audio),
    duration: computed(() => state.duration),
    serverUrl: computed(() => state.serverUrl),
  };
}
