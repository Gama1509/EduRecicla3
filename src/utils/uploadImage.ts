export async function uploadImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
