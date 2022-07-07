const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { imageId, overlay } = req.body;

  try {
    await cloudinary.uploader.upload(
      overlay,
      async function (error, uploadedOverlay) {
        const response = await cloudinary.image(`${imageId}.jpg`, {
          transformation: [
            { overlay: `${uploadedOverlay.public_id}` },
            { flags: "region_relative", width: "1.1", crop: "scale" },
            { flags: "layer_apply", gravity: "adv_faces" },
          ],
          sign_url: true,
        });
        res.status(200).json(response);
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
