const axios = require("axios");
const chalk = require("chalk");
const fetch = require("node-fetch");
// check valid URL format

const getValidURLFormat = (text) => {
  /* eslint-disable */
  let regEx1 = /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/g;
  let validURLs = text.match(regEx1);
  return validURLs;
};

// check status of each URL


const checkURL = async (url, flag = "all") => {
  await fetch(url, { method: "head" })
    .then((response) => {
      if (response.status == 200) {
        if (flag == "all" || flag == "good")
          console.log(
            chalk.green("[GOOD]" + "[" + response.status + "]" + " " + url)
          );
      } else if (response.status == 400 || response.status == 404) {
        if (flag == "all" || flag == "bad") {
          console.log(
            chalk.red("[BAD]" + "[" + response.status + "]" + " " + url)
          );
        }
      } else {
        if (flag == "all")
          console.log(
            chalk.gray("[UNKOWN]" + "[" + response.status + "]" + " " + url)
          );
      }
    })
    .catch(() => {
      if (flag == "all") console.log(chalk.gray("[UNKOWN][ENOTFOUND] " + url));
    });
};

//archived version from wayback machine url
const archivedURL = (url) => {
  let bashed_url = encodeURIComponent(url, 26, true);
  axios
    .get(`http://archive.org/wayback/available?url=${bashed_url}`)
    .then((response) => {
      if (response.data.archived_snapshots.length == 0) {
        console.log(`There is no archived version available for ${url}`);
      } else {
        console.log(
          "Check out the archived version at " +
            chalk.green.bold(`${response.data.archived_snapshots.closest.url}`)
        );
      }
    })
    .catch((err) => console.log(err));
};

//out json result of an url

const jsonResult = async (url) => {
  let result = {
    url: url,
    status: "",
  };

  await fetch(url, { method: "head" })
    .then((response) => {
      result.status = response.status;
    })
    .catch((err) => {
      result.status = "unknown";
    });
  console.log(result);
};

//call checkURL based on filtered/unfiltered URLs and arguments

const manageURL = (validURLs, argv) => {
  if (argv.f || argv.all) {
    for (let i = 0; i < validURLs.length; i++) {
      checkURL(validURLs[i]);
    }
  } else if (argv.good) {
    for (let i = 0; i < validURLs.length; i++) {
      checkURL(validURLs[i], "good");
    }
  } else if (argv.bad) {
    for (let i = 0; i < validURLs.length; i++) {
      checkURL(validURLs[i], "bad");
    }
  }
};

module.exports = {
  getValidURLFormat,
  checkURL,
  archivedURL,
  jsonResult,
  manageURL
};
