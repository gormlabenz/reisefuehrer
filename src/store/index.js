import { reactive, computed } from "vue";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;
import WikiJS from "wikijs";

const state = reactive({
  position: "",
  pages: [],
});

export default function Store() {
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
    console.log("push page");
  };

  async function fetchPage(title) {
    console.log("title", title);
    let page = await WikiJS().page(title);

    const summary = page.summary();
    const mainImage = page.mainImage();
    const info = page.fullInfo();
    const url = page.url();

    const values = await Promise.all([summary, mainImage, info, url]);

    const result = {
      summary: values[0],
      mainImage: values[1],
      info: values[2],
      url: values[3],
    };

    console.log("fetched page");
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

    console.log("values", values.query.geosearch);

    return values.query.geosearch;
  }

  async function setPages() {
    await fetchPosition();
    console.log("position", state.position);
    const pages = await fetchPages(state.position);
    console.log("pages", pages);
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
    fetchPosition,
    fetchPages,
    setPages,
  };
}
