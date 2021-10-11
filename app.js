let query;
let url;

let search = () => {
  console.log(searchInput.value.toLowerCase());
  query = searchInput.value.toLowerCase();
  url = `https://pixabay.com/api/?key=23807255-4b190410e4170d46b41dc4788&q=${query}&image_type=photo`;

  renderUI().then((result) => {
    console.log(result);
    let rgb = getAverageRGB(document.getElementById("i"));
    document.getElementById("dominantColour").style.backgroundColor =
      "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    console.log("rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
  });
};

let getAverageRGB = (imgEl) => {
  var blockSize = 5,
    defaultRGB = { r: 0, g: 0, b: 0 },
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    console.log(e);
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
};

let getImages = async () => {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

let renderUI = async () => {
  let images = await getImages();
  let imageURL = images.hits[0].webformatURL;
  let base62String = await converToBase64(imageURL);

  document.getElementById("hidden-div").innerHTML = ` <img
            src=${base62String}
            alt="card image"
            id="i" crossorigin=""
          />`;
  document.getElementById("hidden-div").style.display = "none";
  return base62String;
};

async function converToBase64(url) {
  let blob = await fetch(url).then((r) => r.blob());
  let dataUrl = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  return await dataUrl;
}
