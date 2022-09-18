const axios = require("axios").default;
const mergeImg = require("merge-img");
const argv = require("minimist")(process.argv.slice(2));

const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const params = { width, height, color, s: size, encoding: "binary" };

const responseType = "arraybuffer";

const getFirstImage = () => {
  return axios
    .get(`https://cataas.com/cat/says/${greeting}`, {
      params,
      responseType,
    })
    .then((response) => {
      console.log("Received response with status:" + response.status);
      return response.data;
    })
    .catch((error) => {
      console.log("Error while fetching first image", error);
      process.exit(1);
    });
};

const getSecondImage = () => {
  return axios
    .get(`https://cataas.com/cat/says/${who}`, {
      params,
      responseType,
    })
    .then((response) => {
      console.log("Received response with status:" + response.status);
      return response.data;
    })
    .catch((error) => {
      console.log("Error while fetching second image", error);
      process.exit(1);
    });
};

const combineImages = (firstImg, secImg) => {
  return mergeImg([
    Buffer.from(firstImg, "binary"),
    Buffer.from(secImg, "binary"),
  ])
    .then((img) => img.write("cataas.png", () => console.log("Image saved!")))
    .catch((error) => {
      console.log("Error while combinig the images");
      process.exit(1);
    });
};

const createFullImage = async () => {
  try {
    const [firstImg, secImg] = await axios.all([
      getFirstImage(),
      getSecondImage(),
    ]);
    await combineImages(firstImg, secImg);
  } catch (error) {
    console.error("Error while creating full image", error);
    process.exit(1);
  }
}

createFullImage();
