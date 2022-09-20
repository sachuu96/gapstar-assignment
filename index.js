const axios = require("axios").default;
const mergeImg = require("merge-img");
const argv = require("minimist")(process.argv.slice(2));

const {endpoint} = require("./constant");

//retriew arguments from the command and set default values
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

//common function to generate two images by parameterizing the base url
const generateImage = (url)=>{
  return axios
    .get(url, {
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

//combine the above retriewed images
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

//create the full image by combining the images asynchronously
const createFullImage = async () => {
  try {
    const [firstImg, secImg] = await axios.all([
      generateImage(`${endpoint}/${greeting}`),
      generateImage(`${endpoint}/${who}`),
    ]);
    await combineImages(firstImg, secImg);
  } catch (error) {
    console.error("Error while creating full image", error);
    process.exit(1);
  }
}

createFullImage();
