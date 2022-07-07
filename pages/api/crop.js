const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  try {
    const response = await cloudinary.image(`${req.body.imageId}.jpg`, {
      gravity: "adv_faces",
      height: 240,
      width: 240,
      crop: "thumb",
      sign_url: true,
    });
    res.status(200).json(response);
    console.log(response)
  } catch (error) {
    res.status(500).json(error);
  }
}
