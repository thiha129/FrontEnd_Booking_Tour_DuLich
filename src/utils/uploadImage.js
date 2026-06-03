import { BASE_URL } from "./config";

export const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/upload/single`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result.data.url;
};

export const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${BASE_URL}/upload/multiple`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result.data.urls;
};
