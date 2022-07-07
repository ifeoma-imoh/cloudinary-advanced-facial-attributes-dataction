import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [image, setImage] = useState("");
  const [uploadStatus, setUploadStatus] = useState();
  const [imageId, setImageId] = useState("");
  const [cldData, setCldData] = useState("");
  const [overlay, setOverlay] = useState("");

  const handleImageChange = (e, setStateFunc) => {
    const reader = new FileReader();
    if (!e.target.files[0]) return;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      setStateFunc(e.target.result);
    };
  };

  const handleUpload = async () => {
    setUploadStatus("Uploading...");
    try {
      const response = await axios.post("/api/upload", { image });
      setImageId(response.data.public_id);
      setUploadStatus("Upload successful");
      console.log(response.data);
    } catch (error) {
      setUploadStatus("Upload failed..");
    }
  };

  const handleCrop = async () => {
    setUploadStatus("Cropping...");
    try {
      const response = await axios.post("/api/crop", { imageId });
      const imageUrl = /'(.+)'/.exec(response.data)[1].split("' ")[0];
      setCldData(imageUrl);
      setUploadStatus("done");
    } catch (error) {
      setUploadStatus("failed..");
    }
  };

  const handleAddOverlay = async () => {
    setUploadStatus("Adding overlay...");
    try {
      const response = await axios.post("/api/overlay", { imageId, overlay });
      const imageUrl = /'(.+)'/.exec(response.data)[1];
      setCldData(imageUrl);
      setUploadStatus("done");
    } catch (error) {
      setUploadStatus("failed..");
    }
  };

  return (
    <main className={styles.main}>
      <h2>Facial attributes detection</h2>
      <div>
        <div className={styles.input}>
          <div>
            <label htmlFor="image">
              {image ? (
                <img src={image} alt="image" />
              ) : (
                "Click to select image"
              )}
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => handleImageChange(e, setImage)}
            />
          </div>
          <button onClick={handleUpload}>Upload</button>
          <p>{uploadStatus}</p>

          <div className={styles.btns}>
            <button disabled={!imageId} onClick={handleCrop}>
              Crop
            </button>

            <button disabled={!imageId || !overlay} onClick={handleAddOverlay}>
              Add Overlay
            </button>
          </div>
          {/* add this */}
          <div className={styles.overlay}>
            <label>Select Overlay</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, setOverlay)}
            />
          </div>
        </div>

        <div className={styles.output}>
          {cldData ? <img src={cldData} alt=" " /> : "Output image"}
        </div>
      </div>
    </main>
  );
}
