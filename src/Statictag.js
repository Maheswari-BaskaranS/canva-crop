
import React, { useState, useRef } from 'react';


const Statictag = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [tags, setTags] = useState([]);
    const imageRef = useRef();
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        setImageSrc(reader.result);
      };
  
      reader.readAsDataURL(file);
    };
  
    const handleCrop = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { width, height } = imageRef.current;
  
      canvas.width = width;
      canvas.height = height;
  
      const x = 100; 
      const y = 50; 
      const cropWidth = 100;
      const cropHeight = 300; 
  
      ctx.drawImage(imageRef.current, x, y, cropWidth, cropHeight, 0, 0, width, height);
  
      const croppedImageUrl = canvas.toDataURL();
  
      setCroppedImage(croppedImageUrl);
    };
  
    const handleTagClick = (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      setTags([...tags, { x, y, text: '' }]);
    };
  
    const handleTagChange = (index, text) => {
      const updatedTags = [...tags];
      updatedTags[index].text = text;
      setTags(updatedTags);
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
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                
                    <input
                  type="text"
                  value={tag.text}
                  onChange={(e) => {
                    const updatedTags = [...tags];
                    updatedTags[index].text = e.target.value;
                    setTags(updatedTags);
                  }}
                  style={{ width: '100%', border: 'none', background: 'transparent' }}
                />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}

export default Statictag



