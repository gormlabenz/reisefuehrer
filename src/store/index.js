import { reactive, computed } from "vue";
import { Plugins } from "@capacitor/core";
import axios from "axios";
const { Geolocation } = Plugins;
/* const WikiJS = require("wikipedia"); */
const wtf = require("wtf_wikipedia");

const state = reactive({
  position: "",
  pages: {},
  loading: false,
});

export default function Store() {
  /* Loading */
  function intervalFetching() {
    toggleLoading();
    setInterval(setPages(), 1000);
    toggleLoading();
  }

  function toggleLoading() {
    state.loading = !state.loading;
  }

  /* Position */
  async function fetchPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    const data = await coordinates;
    setPosition(data.coords);
  }
  const setPosition = (position) => {
    state.position = position;
    console.log("set position");
  };

  /* Pages */
  const pushPage = (key, value) => {
    state.pages[key] = value;
  };

  function togglePageLoading(pageID) {
    state.pages[pageID].loading = !state.pages[pageID].loading;
    console.log("loading ", state.pages[pageID].loading);
  }

  async function fetchPage(title) {
    let doc = await wtf.fetch(title).catch((error) => {
      console.log("WTF page error", error);
    });
    const data = doc.json();
    const pageID = data.pageID;
    const summary = doc.section(0).text();
    const mainImage = doc.images(0).json();
    let loading = false;

    const values = await Promise.all([summary, mainImage]).catch((error) => {
      console.log("Promise.all error", error);
    });

    const result = {
      title,
      pageID,
      loading,
      summary: values[0],
      mainImage: values[1].thumb,
    };

    return result;
  }

  async function fetchPages(position) {
    let url = "https://en.wikipedia.org/w/api.php";

    const params = {
      action: "query",
      list: "geosearch",
      gscoord: position.latitude + "|" + position.longitude,
      gsradius: "10000",
      gslimit: "10",
      format: "json",
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key) {
      url += "&" + key + "=" + params[key];
    });

    const response = await fetch(url);
    const values = await response.json();

    return values.query.geosearch;
  }

  async function setPages() {
    await fetchPosition();
    const pages = await fetchPages(state.position);
    for (let page of pages) {
      const pag = await fetchPage(page.title);
      pag["title"] = page.title;
      pag["dist"] = page.dist;
      pushPage(pag["pageID"], pag);
    }
  }

  /* Server */
  async function getData(object) {
    togglePageLoading(object.pageID);
    const data = JSON.stringify(object);
    console.log("Data", data);
    axios({
      method: "post",
      url: "http://127.0.0.1:8000",
      data: { data: data },
    }).then(
      (response) => {
        console.log(response);
        togglePageLoading(object.pageID);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  return {
    position: computed(() => state.position),
    pages: computed(() => state.pages),
    pagesInfo: computed(() => typeof state.pages),
    loading: computed(() => state.loading),
    fetchPosition,
    fetchPages,
    setPages,
    intervalFetching,
    getData,
  };
}
