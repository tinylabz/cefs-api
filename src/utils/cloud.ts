import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dgjtaqrhg",
  api_key: "994829751929783",
  api_secret: "beAoDMZu7OG4I7ShfpuA52FMBv4",
});

export const res = cloudinary.v2.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }
);
