import { reactive, computed } from "vue";
import { Plugins } from "@capacitor/core";
import axios from "axios";
const { Geolocation } = Plugins;
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
  };

  /* Pages */
  const pushPage = (key, value) => {
    // console.log("key", key, "value", value);
    state.pages[key] = value;
  };

  function togglePageLoading(pageID) {
    state.pages[pageID].loading = !state.pages[pageID].loading;
    console.log("loading ", state.pages[pageID].loading);
  }

  function setPageLink(pageID, link) {
    state.pages[pageID].link = link;
    console.log("set link ", link);
  }

  async function fetchPage(title) {
    return new Promise(function(resolve, reject) {
      wtf
        .fetch(title)
        .then((response) => {
          try {
            const data = response.json();
            const pageID = data.pageID;
            const summary = response.section(0).text();
            const mainImage = response.images(0).json();
            const categories = data.categories;
            let loading = false;

            const result = {
              title,
              pageID,
              loading,
              summary,
              mainImage,
              categories,
            };

            resolve(result);
          } catch (error) {
            reject(new Error(error));
          }
        })
        .catch((error) => {
          console.log("WTF page error", error);
          reject(new Error(error));
        });
    });
  }

  async function fetchPageviews(title) {
    let pageviews;
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/" +
        title +
        "/monthly/" +
        (currentYear - 1) +
        "010100/" +
        (currentYear - 1) +
        "123100"
    );
    const json = await response.json();
    json.items.forEach((item) => {
      pageviews = +item.views;
    });

    return pageviews;
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
    console.log(pages);
    for (let page of pages) {
      fetchPage(page.title)
        .then((response) => {
          response["title"] = page.title;
          response["dist"] = page.dist;

          fetchPageviews(page.title)
            .then((pageviews) => {
              response["pageviews"] = pageviews;
            })
            .catch((error) => {
              console.log("pageview error", error);
              response["pageviews"] = undefined;
            });

          /* const link = "http://localhost:8000/storys/" + page.pageid + ".wav";
          fetch(link)
            .then((response["link"] = link))
            .catch(() => {
              response["link"] = "";
              console.log("Audio not generated yet", response["title"]);
            }); */

          pushPage(response["pageID"], response);
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  }

  /* Server */
  async function getData(page) {
    const pageID = page.pageID;
    togglePageLoading(pageID);
    const data = JSON.stringify(page);
    console.log("Data", data);
    axios({
      method: "post",
      url: "http://127.0.0.1:8000",
      data: { data: data },
    }).then(
      (response) => {
        console.log(response);
        const link = "http://localhost:8000/storys/" + page.pageID + ".wav";
        setPageLink(pageID, link);
        togglePageLoading(pageID);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /* Sorted Pages */

  const sortedPages = computed(() => {
    const dist = [];

    const pages = state.pages;

    for (let page in pages) {
      dist.push(pages[page].dist);
    }

    dist.sort(function(a, b) {
      return a - b;
    });

    const sortedPages = [];

    for (let dis in dist) {
      for (let page in pages) {
        if (dist[dis] == pages[page].dist) {
          sortedPages.push(pages[page]);
        }
      }
    }

    return sortedPages;
  });

  return {
    position: computed(() => state.position),
    pages: computed(() => state.pages),
    sortedPages,
    nearestPage: computed(() => sortedPages.value[0]),
    pagesInfo: computed(() => state.pages),
    loading: computed(() => state.loading),
    fetchPosition,
    fetchPages,
    setPages,
    intervalFetching,
    getData,
    setPageLink,
  };
}
