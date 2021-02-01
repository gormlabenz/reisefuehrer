import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
const { Media } = require("@ionic-native/media");
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const state = reactive({
  trackLoading: false, //is currently a audio being fetched
  autoplay: false, //is the autoplay modus on
  isPlaying: false, //is currently a audio being played
  serverUrl: "http://192.168.1.14:5000",
  media: null, //the active audio media data
  mediaPageID: null, //the ID of the active audio
  currentPageIndex: 0, //at wich audio is currently actice in the player, the index indcates the pos in pages
  playDistance: 2000, //At wich desitance should the track be played
  recentlyPlayed: null, //the recently Played audio, gets injected from local storage
  skipThroughRP: false, //if you play audio from the recently Played list, you skip through ecently Played list and not through Playes nearby
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

  async function setSkipThroughRP(boolean) {
    state.skipThroughRP = boolean;
    console.log("skipThroughRP", state.skipThroughRP);
  }

  async function setPlayDistance(int) {
    state.playDistance = int;
  }

  const track = computed(() => {
    if (!trackPages.value[state.currentPageIndex]) {
      return null;
    } else {
      return trackPages.value[state.currentPageIndex];
    }
  });

  const trackPages = computed(() => {
    if (state.skipThroughRP) {
      return state.recentlyPlayed;
    } else {
      return Store().sortedPages.value;
    }
  });

  const lastTrack = computed(() => {
    if (state.currentPageIndex == trackPages.value.length - 1) {
      return true;
    } else {
      return false;
    }
  });

  const firstTrack = computed(() => {
    if (state.currentPageIndex < 1) {
      return true;
    } else {
      return false;
    }
  });

  function addCurrentPageIndex() {
    if (lastTrack.value) {
      state.currentPageIndex = trackPages.value.length;
    } else {
      state.currentPageIndex = state.currentPageIndex + 1;
    }
  }

  function subtractCurrentPageIndex() {
    if (firstTrack.value) {
      state.currentPageIndex = 0;
    } else {
      state.currentPageIndex = state.currentPageIndex - 1;
    }
  }

  /* Fetch Track */

  async function fetchTrack() {
    const data = JSON.stringify(track.value);
    state.trackLoading = true;
    await axios({
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

  /* Load */

  async function preloadMedia() {
    await fetchTrack();
    state.media = Media.create(
      state.serverUrl + "/storys/" + track.value.pageID + ".mp3"
    );

    state.media.onStatusUpdate.subscribe((status) => {
      switch (status) {
        case 1:
          break;
        case 2: // 2: playing
          state.isPlaying = true;
          break;
        case 3: // 3: pause
          state.isPlaying = false;
          break;
        case 4: // 4: stop
        default:
          state.isPlaying = false;
          break;
      }
    });
  }

  /* Storage */

  async function setTrackToRecentlyPlayed() {
    const recently_played = await Storage.get({
      key: "RECENTLY_PLAYED",
    });
    var currentTime = new Date();
    console.log("time", currentTime);

    let recently_played_list;
    if (!recently_played.value) {
      recently_played_list = [];
    } else {
      recently_played_list = JSON.parse(recently_played.value);
    }

    function isSameTrack(listTrack) {
      if (listTrack.pageID != track.value.pageID) {
        return listTrack;
      }
    }

    function today() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      return mm + "." + dd + "." + yyyy;
    }

    recently_played_list = recently_played_list.filter(isSameTrack);
    let newTrack = track.value;
    newTrack.date = today();

    recently_played_list.push(newTrack);

    Storage.set({
      key: "RECENTLY_PLAYED",
      value: JSON.stringify(recently_played_list),
    });
  }

  async function setRecentlyPlayed() {
    let recentlyPlayed = await Storage.get({ key: "RECENTLY_PLAYED" });
    state.recentlyPlayed = JSON.parse(recentlyPlayed.value);
  }

  /* Autoplay */

  async function setAutoplayTrack() {
    let pages = Store().sortedPages.value;

    if (state.autoplay == true && state.isPlaying == false) {
      for (let index = 0; index < pages.length; index++) {
        if (
          pages[index].dist < state.playDistance &&
          !state.recentlyPlayed.includes(pages[index])
        ) {
          console.log("index", index);
          setSkipThroughRP(false);
          console.log("dist", pages[index].dist);
          state.currentPageIndex = index;
          console.log("playing", pages[index]);
          play();

          return;
        }
      }
    }
  }

  /* Audio Controlls */

  async function clearMedia() {
    if (state.media) {
      await state.media.stop();
      await state.media.release();
    }
  }

  async function play() {
    if (state.mediaPageID != track.value.pageID) {
      setTrackToRecentlyPlayed();
      if (!state.skipThroughRP) {
        setRecentlyPlayed(); //only save track if it was selected from "places nearby"
      }
      await clearMedia();
      await preloadMedia();
    }
    state.mediaPageID = track.value.pageID;
    state.media.play();
  }

  function pause() {
    state.media.pause();
  }
  function skip() {
    console.log("index", state.currentPageIndex);
    clearMedia();
    addCurrentPageIndex();
    //Storage.remove({ key: "RECENTLY_PLAYED" });
  }
  function skipBack() {
    clearMedia();
    subtractCurrentPageIndex();
  }

  return {
    track,
    firstTrack,
    lastTrack,
    setCurrentPageIndex,
    toggleAutoplay,
    play,
    pause,
    skip,
    skipBack,
    setPlayDistance,
    setRecentlyPlayed,
    setAutoplayTrack,
    setSkipThroughRP,
    trackLoading: computed(() => state.trackLoading),
    autoplay: computed(() => state.autoplay),
    playDistance: computed(() => state.playDistance),
    isPlaying: computed(() => state.isPlaying),
    currentPageIndex: computed(() => state.currentPageIndex),
    recentlyPlayed: computed(() => state.recentlyPlayed),
  };
}
