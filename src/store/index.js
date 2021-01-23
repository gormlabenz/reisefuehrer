import { reactive, computed } from "vue";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;
const wtf = require("wtf_wikipedia");

const state = reactive({
  position: "",
  initLoad: false,
  defaultImage: require("../assets/default_image.png"),
  pages: {},
});

export default function Store() {
  /* Position */
  async function fetchPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    const data = coordinates;
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
            var mainImage = {
              file: "trek",
              thumb: state.defaultImage,
              url: state.defaultImage,
            };
            if (typeof response.images(0) !== "undefined") {
              mainImage = response.images(0).json();
            }
            const categories = data.categories;
            const result = {
              title,
              pageID,
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
    new Promise(function(resolve) {
      const _ = async function() {
        await fetchPosition();
        const pages = await fetchPages(state.position);
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

              pushPage(response["pageID"], response);
            })
            .catch((error) => {
              console.warn(error);
            });
        }
        state.initLoad = true;
      };
      _().then(() => resolve());
    });
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
    sortedPages,
    pages: computed(() => state.pages),
    defaultImage: computed(() => state.defaultImage),
    initLoad: computed(() => state.initLoad),
    nearestPage: computed(() => sortedPages.value[0]),
    setPages,
    setPageLink,
  };
}
