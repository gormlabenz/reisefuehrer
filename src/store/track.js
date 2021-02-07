import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";
const { Media } = require("@ionic-native/media");
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const state = reactive({
  trackLoading: false, //is currently a audio being fetched
  fetchError: false, //if fetch error is true, the server is not reachable
  fetchLong: false,
  fetchDuration: 30000,
  cancelTokenSource: null,
  autoplay: false, //is the autoplay modus on
  isPlaying: false, //is currently a audio being played
  serverUrl: "https://triptalk.ddns.net",
  media: null, //the active audio media data
  mediaPageID: null, //the ID of the active audio
  currentPageIndex: 0, //at wich audio is currently actice in the player, the index indcates the pos in pages
  playDistance: 2000, //At wich desitance should the track be played
  recentlyPlayed: [], //the recently Played audio, gets injected from local storage
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
    state.cancelTokenSource = axios.CancelToken.source();
    setFetchLong();
    await axios(
      {
        method: "post",
        url: state.serverUrl,
        data,
      },
      { timeout: state.fetchDuration, cancelToken: state.cancelTokenSource }
    )
      .then((response) => {
        state.fetchError = false;
        return response;
      })
      .catch((error) => {
        console.log(error);
        state.fetchError = true;
      })
      .finally(() => {
        state.trackLoading = false;
      });
  }

  function setFetchLong() {
    setTimeout(() => {
      if (state.trackLoading) {
        state.fetchLong = true;
        console.log("fetchLong", state.fetchLong);
      }
    }, 4000);
    state.fetchLong = false;
    console.log("fetchLong", state.fetchLong);
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

  async function cancelFetch() {
    state.cancelTokenSource.cancel();
    state.trackLoading = false;
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
    if (recentlyPlayed.value) {
      state.recentlyPlayed = JSON.parse(recentlyPlayed.value);
    }
  }

  /* Autoplay */

  async function setAutoplayTrack() {
    let pages = Store().sortedPages.value;
    let recentlyPlayedPageIDS = state.recentlyPlayed.map((page) => page.pageID);

    if (state.autoplay == true && state.isPlaying == false) {
      for (let index = 0; index < pages.length; index++) {
        if (
          pages[index].dist < state.playDistance &&
          !recentlyPlayedPageIDS.includes(pages[index].pageID)
        ) {
          console.log("playing", pages[index]);
          setSkipThroughRP(false);
          state.currentPageIndex = index;
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
      setRecentlyPlayed();
      if (!state.skipThroughRP) {
        //only save track if it was selected from "places nearby"
        setTrackToRecentlyPlayed();
      }
      await clearMedia();
      await preloadMedia();
    }
    state.mediaPageID = track.value.pageID;
    state.media.play();
  }

  function pause() {
    state.media.pause();
    cancelFetch();
  }
  function skip() {
    console.log("index", state.currentPageIndex);
    clearMedia();
    addCurrentPageIndex();
    cancelFetch();
    //Storage.remove({ key: "RECENTLY_PLAYED" });
  }
  function skipBack() {
    clearMedia();
    subtractCurrentPageIndex();
    cancelFetch();
  }

  return {
    track,
    firstTrack,
    lastTrack,
    clearMedia,
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
    fetchLong: computed(() => state.fetchLong),
    autoplay: computed(() => state.autoplay),
    playDistance: computed(() => state.playDistance),
    isPlaying: computed(() => state.isPlaying),
    currentPageIndex: computed(() => state.currentPageIndex),
    recentlyPlayed: computed(() => state.recentlyPlayed),
  };
}
