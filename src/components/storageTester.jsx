// DownloadImage.jsx
import React, { useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';  // Import storage from your Firebase config file

const StorageTester = () => {
  const [imageUrl, setImageUrl] = useState(null);  // State to store the downloaded image URL

  const handleDownload = async () => {
    const imageRef = ref(storage, 'Pic1.png'); // Specify the path to your image in Firebase Storage

    try {
      const url = await getDownloadURL(imageRef);  // Get the download URL from Firebase Storage
      setImageUrl(url);  // Store the image URL in state
      console.log('Image URL:', url);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download Image</button>  {/* Button to download the image */}
      
      {imageUrl && (
        <div>
          <h3>Downloaded Image:</h3>
          <img src={imageUrl} alt="Downloaded" style={{ width: '300px', height: 'auto' }} /> {/* Display the downloaded image */}
        </div>
      )}
    </div>
  );
};

export default StorageTester;
