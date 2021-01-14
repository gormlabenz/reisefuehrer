import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
import { Howl } from "howler";

const state = reactive({
  settedTrack: null,
  trackLoading: false,
  audio: null,
  duration: 0,
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
  async function setDuration(duration) {
    state.duration = duration;
  }

  const audioPlaying = computed(() => {
    try {
      return state.audio.playing();
    } catch {
      return false;
    }
  });

  const audioDuration = computed(() => {
    try {
      return state.audio.duration();
    } catch {
      return 0;
    }
  });

  /* const audioPos = computed(() => {
    try {
      return state.audio.pos();
    } catch {
      return 0;
    }
  }); */

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
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        state.trackLoading = false;
      });
  }

  /* Audio Controlls */

  async function play() {
    var audio = new Howl({
      src: [state.serverUrl + "/storys/" + track.value.pageID + ".mp3"],
      preload: true,
      html5: true,
    });
    console.log("audio", audio);
    setAudio(audio);
    setDuration(audio.duration());
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
    audioDuration,
    //audioPos,
    trackLoading: computed(() => state.trackLoading),
    audio: computed(() => state.audio),
    duration: computed(() => state.duration),
    serverUrl: computed(() => state.serverUrl),
  };
}
