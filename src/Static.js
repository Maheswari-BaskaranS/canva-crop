
import React, { useState, useRef } from 'react';
function Static() {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [tags, setTags] = useState([]);
  const imageRef = useRef();

  // Function to handle when a file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Function to handle image cropping
  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = imageRef.current;

    canvas.width = width;
    canvas.height = height;

    // Calculate the coordinates of the cropped area (assuming shirt coordinates)
    const x = 100; // example x coordinate
    const y = 100; // example y coordinate
    const cropWidth = 100; // example width of the cropped area
    const cropHeight = 250; // example height of the cropped area

    // Draw the cropped area onto the canvas
    ctx.drawImage(imageRef.current, x, y, cropWidth, cropHeight, 0, 0, width, height);

    // Get the cropped image data URL
    const croppedImageUrl = canvas.toDataURL();

    // Set the cropped image
    setCroppedImage(croppedImageUrl);
  };

  const handleTagClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTags([...tags, { x, y }]);
  };

  return (
    <div>
     
      <input type="file" onChange={handleFileChange} />
      {imageSrc && (
        <div>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Selected Image"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
          <button onClick={handleCrop}>Crop Shirt</button>
        </div>
      )}
      {croppedImage && (
        <div>
          <h2>Cropped Image</h2>
          <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={croppedImage} alt="Cropped Shirt" onClick={handleTagClick} style={{ cursor: 'crosshair' }} />
          {tags.map((tag, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: tag.x,
                  top: tag.y,
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  width: '10px',
                  height: '10px',
                  transform: 'translate(-50%, -50%)',
                }}
              ></div>
            ))}
          </div>
        </div>

      )}
    </div>
  );
}
export default Static

