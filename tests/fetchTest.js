const wtf = require("wtf_wikipedia");
const axios = require("axios");

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
          const second_section = "";
          if (response.section(2)) {
            const second_section = response.section(2).text();
          }
          let loading = false;

          const result = {
            second_section,
            title,
            pageID,
            loading,
            summary,
            mainImage,
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

async function getData(page) {
  const pageID = page.pageID;
  const data = JSON.stringify(page);
  console.log("Data", data);
  axios({
    method: "post",
    url: "http://127.0.0.1:5000",
    data,
  }).then(
    (response) => {
      console.log(response);
      const link = "http://localhost:5000/storys/" + page.pageID + ".wav";
    },
    (error) => {
      console.log(error);
    }
  );
}

async function main() {
  page = await fetchPage("Switzerland");
  getData(page);
}

main();
