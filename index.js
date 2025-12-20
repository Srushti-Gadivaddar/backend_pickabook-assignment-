// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const express = require("express");
// const app = express();
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const faceapi = require("face-api.js");
// const axios = require("axios");
// const canvas = require("canvas");
// const { getAverageColor } = require("fast-average-color-node");

// const { storage } = require("./cloudinaryConfig.js");
// const upload = multer({ storage });

// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// app.use(cors());
// app.use(express.json({ limit: "50mb" }));

// // Load face-api models
// const MODEL_URL = path.join(__dirname, "models");
// Promise.all([
//   faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
//   faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
//   faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL),
// ]).then(() => console.log("✅ Face models loaded"));

// // ================== Upload Endpoint ==================
// app.post("/upload", upload.single("image"), (req, res) => {
//   res.json({ imageUrl: req.file.path });
// });

// // ================== Helper Functions ==================
// function calculateHeadTilt(landmarks) {
//   const leftEye = landmarks[36];
//   const rightEye = landmarks[45];
//   return Math.round(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI));
// }

// function estimateHeadTurn(landmarks) {
//   const nose = landmarks[30];
//   const leftEye = landmarks[36];
//   const rightEye = landmarks[45];
//   const eyeCenterX = (leftEye.x + rightEye.x) / 2;
//   const diff = nose.x - eyeCenterX;
//   if (diff > 10) return "right";
//   if (diff < -10) return "left";
//   return "center";
// }

// function detectSmile(landmarks) {
//   const vertical = Math.abs(landmarks[57].y - landmarks[51].y);
//   const horizontal = Math.abs(landmarks[54].x - landmarks[48].x);
//   return vertical / horizontal > 0.2 ? "smiling" : "neutral";
// }

// async function detectAverageColor(imageUrl, region = null) {
//   try {
//     const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
//     const buffer = Buffer.from(response.data);
//     const img = await canvas.loadImage(buffer);

//     if (region) {
//       const tempCanvas = canvas.createCanvas(region.width, region.height);
//       const ctx = tempCanvas.getContext("2d");

//       ctx.drawImage(
//         img,
//         region.x,
//         region.y,
//         region.width,
//         region.height,
//         0,
//         0,
//         region.width,
//         region.height
//       );

//       const cropped = tempCanvas.toBuffer("image/png");
//       const color = await getAverageColor(cropped);
//       return color.hex || "#aabbcc";
//     }

//     const color = await getAverageColor(buffer);
//     return color.hex || "#aabbcc";
//   } catch (err) {
//     console.warn("Color detection failed:", err.message);
//     return "#aabbcc";
//   }
// }

// // ================== Generate Cartoon ==================
// async function generateChildCartoon(
//   imageUrl,
//   faceData,
//   outfitColor,
//   hairColor,
//   eyeColor,
//   headTurn,
//   smileStatus
// ) {
//   const { gender, landmarks } = faceData;
//   const eyeDistance = Math.round(Math.abs(landmarks[45].x - landmarks[36].x));
//   const headTilt = calculateHeadTilt(landmarks);

//   const prompt = `
//     Transform this ${gender} child into a cute 6-year-old,
//     Pixar 3D style, storybook illustration, pastel colors,
//     outfit color ${outfitColor},
//     hair color ${hairColor},
//     eye color ${eyeColor},
//     big expressive eyes (eye distance ${eyeDistance}px),
//     ${smileStatus},
//     head tilt ${headTilt} degrees,
//     facing ${headTurn}
//   `;

//   const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?input=${encodeURIComponent(imageUrl)}`;

//   const response = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
//   return `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;
// }

// // ================== Generate Endpoint ==================
// app.post("/generate", async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });

//     const img = await canvas.loadImage(imageUrl);
//     const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withAgeAndGender();

//     if (!detection) return res.status(400).json({ error: "No face detected" });

//     const landmarks = detection.landmarks.positions;
//     const faceData = {
//       age: Math.round(detection.age),
//       gender: detection.gender,
//       landmarks,
//     };

//     // Define regions for colors
//     const outfitRegion = { x: landmarks[8].x - 50, y: landmarks[8].y, width: 100, height: 150 };
//     const hairRegion = { x: landmarks[19].x - 50, y: landmarks[19].y - 60, width: 100, height: 60 };
//     const eyeRegion = {
//       x: landmarks[36].x - 10,
//       y: landmarks[36].y - 10,
//       width: landmarks[45].x - landmarks[36].x + 20,
//       height: 20,
//     };

//     const outfitColor = await detectAverageColor(imageUrl, outfitRegion);
//     const hairColor = await detectAverageColor(imageUrl, hairRegion);
//     const eyeColor = await detectAverageColor(imageUrl, eyeRegion);

//     const headTurn = estimateHeadTurn(landmarks);
//     const smileStatus = detectSmile(landmarks);

//     const cartoonImage = await generateChildCartoon(
//       imageUrl,
//       faceData,
//       outfitColor,
//       hairColor,
//       eyeColor,
//       headTurn,
//       smileStatus
//     );

//     res.json({ image: cartoonImage });
//   } catch (err) {
//     console.error("Generation failed:", err.message);
//     res.status(500).json({ error: "Generation failed" });
//   }
// });

// // ================== Start Server ==================
// app.listen(8080, () => {
//   console.log("🚀 Server running on port 8080");
// });


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const faceapi = require("face-api.js");
const axios = require("axios");
const canvas = require("canvas");
const { getAverageColor } = require("fast-average-color-node");

const { storage } = require("./cloudinaryConfig.js");
const upload = multer({ storage });

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ================= LOAD MODELS =================
const MODEL_URL = path.join(__dirname, "models");
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
  faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL),
]).then(() => console.log("✅ Face models loaded"));

// ================= UPLOAD =================
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

// ================= HELPERS =================
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function calculateHeadTilt(lm) {
  return Math.atan2(lm[45].y - lm[36].y, lm[45].x - lm[36].x) * (180 / Math.PI);
}

function estimateHeadTurn(lm) {
  const noseX = lm[30].x;
  const centerX = (lm[36].x + lm[45].x) / 2;
  const diff = noseX - centerX;
  if (diff > 10) return "right";
  if (diff < -10) return "left";
  return "center";
}

function detectSmile(lm) {
  const mouthOpen = Math.abs(lm[57].y - lm[51].y);
  const mouthWidth = Math.abs(lm[54].x - lm[48].x);
  return mouthOpen / mouthWidth > 0.2 ? "smiling" : "neutral";
}

// ================= SAFE COLOR DETECTION =================
async function detectAverageColor(imageUrl, region, imgWidth, imgHeight) {
  try {
    const res = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      maxRedirects: 5,
    });

    const img = await canvas.loadImage(res.data);

    const x = clamp(region.x, 0, imgWidth - 1);
    const y = clamp(region.y, 0, imgHeight - 1);
    const w = clamp(region.width, 10, imgWidth - x);
    const h = clamp(region.height, 10, imgHeight - y);

    const c = canvas.createCanvas(w, h);
    const ctx = c.getContext("2d");

    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

    const color = await getAverageColor(c.toBuffer("image/png"));
    return color.hex || "#d1bfa7";
  } catch (e) {
    console.warn("⚠ Color detect fallback");
    return "#d1bfa7";
  }
}

// ================= CARTOON GENERATION =================
async function generateChildCartoon(
  imageUrl,
  faceData,
  outfitColor,
  hairColor,
  eyeColor,
  headTurn,
  smile
) {
  const prompt = `
  Pixar style 3D child character,
  age 5-7,
  ${faceData.gender},
  cinematic soft lighting,
  subsurface skin scattering,
  smooth skin gradient,
  hair color ${hairColor},
  eye color ${eyeColor},
  outfit color ${outfitColor},
  ${smile},
  facing ${headTurn},
  same illustration style,
  no background, transparent
  `;

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?input=${encodeURIComponent(imageUrl)}`;

  const r = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  return `data:image/png;base64,${Buffer.from(r.data).toString("base64")}`;
}

// ================= GENERATE =================
app.post("/generate", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });

    const img = await canvas.loadImage(imageUrl);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withAgeAndGender();

    if (!detection) return res.status(400).json({ error: "No face detected" });

    const lm = detection.landmarks.positions;
    const box = detection.detection.box;

    const hairRegion = {
      x: box.x,
      y: box.y - box.height * 0.25,
      width: box.width,
      height: box.height * 0.25,
    };

    const eyeRegion = {
      x: lm[36].x,
      y: lm[37].y - 5,
      width: lm[45].x - lm[36].x,
      height: 20,
    };

    const outfitRegion = {
      x: box.x,
      y: box.y + box.height,
      width: box.width,
      height: box.height * 0.8,
    };

    const hairColor = await detectAverageColor(
      imageUrl,
      hairRegion,
      img.width,
      img.height
    );

    const eyeColor = await detectAverageColor(
      imageUrl,
      eyeRegion,
      img.width,
      img.height
    );

    const outfitColor = await detectAverageColor(
      imageUrl,
      outfitRegion,
      img.width,
      img.height
    );

    const cartoon = await generateChildCartoon(
      imageUrl,
      detection,
      outfitColor,
      hairColor,
      eyeColor,
      estimateHeadTurn(lm),
      detectSmile(lm)
    );

    res.json({ image: cartoon });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Generation failed" });
  }
});

// ================= START =================
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
