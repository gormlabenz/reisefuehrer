import { reactive, computed } from "vue";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;
/* const WikiJS = require("wikipedia"); */
const wtf = require("wtf_wikipedia");

const state = reactive({
  position: "",
  pages: [],
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

  const pushPage = (page) => {
    state.pages.push(page);
  };

  /* async function fetchPage(title) {
    console.log("title", title);
    const page = await WikiJS.page(title).catch((error) => {
      console.log("WikiJS page error", error);
    });

    const summary = page.summary();
    const mainImage = page.mainImage();
    const info = page.fullInfo();
    const url = page.url();

    const values = await Promise.all([summary, mainImage, info, url]).catch(
      (error) => {
        console.log("Promise.all error", error);
      }
    ); 



    const result = {
      summary: values[0],
      mainImage: values[1],
      info: values[2],
      url: values[3],
    };

    console.log("fetched page");
    return result;
  }*/
  async function fetchPage(title) {
    let doc = await wtf.fetch(title).catch((error) => {
      console.log("WTF page error", error);
    });

    const summary = doc.text();
    const mainImage = doc.images(0).json();
    //const info = page.fullInfo();
    //const url = page.url();

    const values = await Promise.all([summary, mainImage]).catch((error) => {
      console.log("Promise.all error", error);
    });

    const result = {
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
      pushPage(pag);
    }
  }

  return {
    position: computed(() => state.position),
    pages: computed(() => state.pages),
    loading: computed(() => state.loading),
    fetchPosition,
    fetchPages,
    setPages,
    intervalFetching,
  };
}
