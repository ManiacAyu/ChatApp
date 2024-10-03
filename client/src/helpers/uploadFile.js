const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`;
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "example_pretest");
  console.log(file);
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    console.log(response);
    const responseData = await response.json();

    return responseData;
  }
  catch (err) { 
    console.error('Error while uploading file:', err);
    return null;  // or throw an error here to handle it appropriately.
  }
};

export default uploadFile;
