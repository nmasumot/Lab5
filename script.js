// script.js
var voices = [];
var voiceSelect = document.querySelector('select');
voices = window.speechSynthesis.getVoices();
var synth = window.speechSynthesis;
setTimeout(() => {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.remove(0);
  for(var i = 0; i < voices.length; i++){
    console.log(voices[i].name);
    var option = document.createElement('option');
    option.textContent = voices[i].name;
    option.value = voices[i];
    if(voices[i].default){
      option.textContext += ' --DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.disabled = false;
  console.log(voiceSelect);
},1000);

const img = new Image(); // used to load image from <input> and draw to canvas
var imageInput = document.getElementById("image-input");
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //console.log("loaded");
  var canvas = document.getElementById("user-image").getContext('2d');
  canvas.fillStyle = "#000000";
  canvas.fillRect(0, 0, 400, 400);
  var placement = getDimmensions(400,400,img.width,img.height);
  canvas.drawImage(img,placement.startX,placement.startY,placement.width,placement.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

imageInput.addEventListener('input', () => {
  const objectURL = URL.createObjectURL(document.getElementById("image-input").files[0]);
  //console.log(document.getElementById("image-input").files[0]);
  img.src = objectURL;
});

var submitBtn = document.querySelector("[type = submit]");
var clearBtn = document.querySelector("[type = reset]");
var voiceBtn = document.querySelector("[type = button]");


submitBtn.addEventListener('click',  event =>{
  event.preventDefault();
  var canvas = document.getElementById("user-image").getContext('2d');
  var topText = document.getElementById("text-top");
  console.log(topText.value);
  clearBtn.disabled = false;
  voiceBtn.disabled = false;
  canvas.font = '50px serif';
  var textmetrics = canvas.measureText(topText.value);
  var textposition = getDimmensions(400,400,textmetrics.width,400);
  canvas.fillStyle = "#000000";
  canvas.fillRect(textposition.startX,0,textmetrics.width,50);
  canvas.fillStyle = "#FFFFFF";
  canvas.fillText(topText.value,textposition.startX,40); 
  var bottomText = document.getElementById("text-bottom");
  var bottomMet = canvas.measureText(bottomText.value);
  var bottomposition = getDimmensions(400,400,bottomMet.width,400);
  canvas.fillStyle = "#000000";
  canvas.fillRect(bottomposition.startX,350,bottomMet.width,50);
  canvas.fillStyle = "#FFFFFF";
  canvas.fillText(bottomText.value,bottomposition.startX,390);
});

clearBtn.addEventListener('click', () =>{
  var canvas = document.getElementById("user-image").getContext('2d');
  canvas.clearRect(0,0,400,400);
  console.log("clear ran");
  clearBtn.disabled = true;
  voiceBtn.disabled = true;
});

voiceBtn.addEventListener('click', () => {
  var utterThis = new SpeechSynthesisUtterance(document.getElementById("text-top").value + " " + document.getElementById("text-bottom").value);
  var selectedVoice = document.querySelector('select');
  var voiceName = selectedVoice.options[document.querySelector('select').selectedIndex].getAttribute("data-name");
  for(var i = 0; i < voices.length; i++){
    if(voices[i].name === voiceName){
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = voiceSlider.value/100;
  synth.speak(utterThis);
});

var voiceSlider = document.querySelector("[type = range]");

voiceSlider.addEventListener('change', () => {
  if(voiceSlider.value == 0){
    var volumeImage = document.querySelector("img");
    volumeImage.src = "icons/volume-level-0.svg";
  }else if(voiceSlider.value > 0 && voiceSlider.value < 34){
    var volumeImage = document.querySelector("img");
    volumeImage.src = "icons/volume-level-1.svg";
  }else if(voiceSlider.value > 33 && voiceSlider.value < 67){
    var volumeImage = document.querySelector("img");
    volumeImage.src = "icons/volume-level-2.svg";
  }else if(voiceSlider.value > 66){
    var volumeImage = document.querySelector("img");
    volumeImage.src = "icons/volume-level-3.svg";
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
