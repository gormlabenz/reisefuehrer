import Store from ".";
import { computed, reactive } from "vue";
import axios from "axios";

const state = reactive({
  settedTrack: null,
  trackLoading: false,
});

export default function TrackStore() {
  /* Data */
  async function setTrack(pageID) {
    state.settedTrack = Store().pages.value[pageID];
    console.log("track", Store().pages.value[pageID]);
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

  /* Fetch Track */

  async function fetchTrack() {
    const data = JSON.stringify(track.value);
    state.trackLoading = true;
    console.log("Data", data);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000",
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

  return {
    track,
    setTrack,
    fetchTrack,
    trackLoading: computed(() => state.trackLoading),
  };
}
