// import React, { useState, useRef } from "react";

// const DynamicValues = () => {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [croppedImages, setCroppedImages] = useState([]);
//   const [cropStart, setCropStart] = useState(null);
//   const [cropEnd, setCropEnd] = useState(null);
//   const [tags, setTags] = useState([]);
//   const [tagText, setTagText] = useState("");
//   const imageRef = useRef();
//   const canvasRef = useRef();

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setCropStart(null);
//       setCropEnd(null);
//       setTags([]);
//       setCroppedImages([]);
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleCropStart = (e) => {
//     e.preventDefault();
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setCropStart({ x, y });
//   };

//   const handleCropMove = (e) => {
//     if (!cropStart) return;
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setCropEnd({ x, y });
//     drawCropSelection();
//   };

//   const drawCropSelection = () => {
//     const ctx = canvasRef.current.getContext("2d");
//     const rect = imageRef.current.getBoundingClientRect();
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     if (!cropStart || !cropEnd) return;

//     const startX = Math.min(cropStart.x, cropEnd.x);
//     const startY = Math.min(cropStart.y, cropEnd.y);
//     const width = Math.abs(cropEnd.x - cropStart.x);
//     const height = Math.abs(cropEnd.y - cropStart.y);

//     ctx.strokeStyle = "#FF033E";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(startX, startY, width, height);
//   };

//   const handleCropEnd = () => {
//     drawCropSelection();
//   };

//   const handleCrop = () => {
//     if (!cropStart || !cropEnd) return;

//     const rect = imageRef.current.getBoundingClientRect();
//     const startX = Math.min(cropStart.x, cropEnd.x);
//     const startY = Math.min(cropStart.y, cropEnd.y);
//     const width = Math.abs(cropEnd.x - cropStart.x);
//     const height = Math.abs(cropEnd.y - cropStart.y);

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const { naturalWidth, naturalHeight } = imageRef.current;

//     canvas.width = width;
//     canvas.height = height;

//     ctx.drawImage(
//       imageRef.current,
//       (startX / rect.width) * naturalWidth,
//       (startY / rect.height) * naturalHeight,
//       (width / rect.width) * naturalWidth,
//       (height / rect.height) * naturalHeight,
//       0,
//       0,
//       width,
//       height
//     );

//     const croppedImageUrl = canvas.toDataURL();

//     // Store the cropped image URL along with x, y, width, and height
//     setCroppedImages([
//       ...croppedImages,
//       { url: croppedImageUrl, x: startX, y: startY, width, height }
//     ]);

//     setCropStart(null);
//     setCropEnd(null);
//   };

//   const handleTagClick = (e, croppedImageIndex) => {
//     console.log("Clicked on cropped image index:", croppedImageIndex);
//     const rect = e.target.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Generate a unique tagId based on the current timestamp
//     const tagId = Date.now();

//     setTags([...tags, { x, y, text: tagText, index: croppedImageIndex, tagId }]);
//     setTagText(""); // Reset tag text input
//   };

//   const handleTagChange = (croppedImageIndex, tagId, newText) => {
//     const updatedTags = tags.map((tag) => {
//       if (tag.index === croppedImageIndex && tag.tagId === tagId) {
//         return { ...tag, text: newText };
//       }
//       return tag;
//     });
//     setTags(updatedTags);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {imageSrc && (
//         <div style={{ position: "relative", display: "inline-block" }}>
//           <img
//             ref={imageRef}
//             src={imageSrc}
//             alt="Selected Image"
//             style={{
//               maxWidth: "100%",
//               maxHeight: "400px",
//               cursor: "crosshair",
//             }}
//             onMouseDown={handleCropStart}
//             onMouseMove={handleCropMove}
//             onMouseUp={handleCropEnd}
//             onMouseLeave={handleCropEnd}
//             onDragStart={(e) => e.preventDefault()}
//           />
//           <canvas
//             ref={canvasRef}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               pointerEvents: "none",
//             }}
//           />
//           <button onClick={handleCrop}>Crop Selection</button>
//         </div>
//       )}
//       {croppedImages.map((croppedImage, index) => (
//         <div key={index}>
//           <h2>Cropped Image {index + 1}</h2>
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <img
//               src={croppedImage.url}
//               alt={`Cropped Image ${index + 1}`}
//               onClick={(e) => handleTagClick(e, index)} // Pass the index of the cropped image
//               style={{ cursor: "crosshair" }}
//             />
//             <div style={{ position: "absolute", top: 0, right: 0, padding: "5px" }}>
//               <p>X: {croppedImage.x}</p>
//               <p>Y: {croppedImage.y}</p>
//               <p>Width: {croppedImage.width}</p>
//               <p>Height: {croppedImage.height}</p>
//             </div>
//             {tags
//               .filter((tag) => tag.index === index)
//               .map((tag) => (
//                 <div
//                   key={tag.tagId}
//                   style={{
//                     position: "absolute",
//                     left: tag.x,
//                     top: tag.y,
//                     backgroundColor: "rgba(255, 255, 255, 0.7)",
//                     padding: "4px",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     value={tag.text}
//                     onChange={(e) =>
//                       handleTagChange(index, tag.tagId, e.target.value)
//                     }
//                     style={{
//                       width: "100%",
//                       border: "none",
//                       background: "transparent",
//                     }}
//                   />
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DynamicValues;


import React, { useState, useRef } from "react";

const DynamicValues = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const imageRef = useRef();
  const canvasRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
      setCropStart(null);
      setCropEnd(null);
      setTags([]);
      setCroppedImages([]);
    };

    reader.readAsDataURL(file);
  };

  const handleCropStart = (e) => {
    e.preventDefault();
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropStart({ x, y });
  };

  const handleCropMove = (e) => {
    if (!cropStart) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropEnd({ x, y });
    drawCropSelection();
  };

  const drawCropSelection = () => {
    const ctx = canvasRef.current.getContext("2d");
    const rect = imageRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!cropStart || !cropEnd) return;

    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    ctx.strokeStyle = "#FF033E";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleCropEnd = () => {
    drawCropSelection();
  };

  const handleCrop = () => {
    if (!cropStart || !cropEnd) return;

    const rect = imageRef.current.getBoundingClientRect();
    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    // Store the cropped image URL along with x, y, width, and height
    setCroppedImages([
      ...croppedImages,
      { x: startX, y: startY, width, height }
    ]);

    setCropStart(null);
    setCropEnd(null);
  };

  const handleTagClick = (e, croppedImageIndex) => {
    console.log("Clicked on cropped image index:", croppedImageIndex);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Generate a unique tagId based on the current timestamp
    const tagId = Date.now();

    setTags([...tags, { x, y, text: tagText, index: croppedImageIndex, tagId }]);
    setTagText(""); // Reset tag text input
  };

  const handleTagChange = (croppedImageIndex, tagId, newText) => {
    const updatedTags = tags.map((tag) => {
      if (tag.index === croppedImageIndex && tag.tagId === tagId) {
        return { ...tag, text: newText };
      }
      return tag;
    });
    setTags(updatedTags);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageSrc && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Selected Image"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              cursor: "crosshair",
            }}
            onMouseDown={handleCropStart}
            onMouseMove={handleCropMove}
            onMouseUp={handleCropEnd}
            onMouseLeave={handleCropEnd}
            onDragStart={(e) => e.preventDefault()}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
          <button onClick={handleCrop}>Crop Selection</button>
        </div>
      )}
      {croppedImages.map((croppedImage, index) => (
        <div key={index}>
          <h2>Cropped Image {index + 1}</h2>
          <div>
            <p>X: {croppedImage.x}</p>
            <p>Y: {croppedImage.y}</p>
            <p>Width: {croppedImage.width}</p>
            <p>Height: {croppedImage.height}</p>
          </div>
          {tags
            .filter((tag) => tag.index === index)
            .map((tag) => (
              <div
                key={tag.tagId}
                style={{
                  position: "absolute",
                  left: tag.x,
                  top: tag.y,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  padding: "4px",
                  borderRadius: "5px",
                }}
              >
                <input
                  type="text"
                  value={tag.text}
                  onChange={(e) =>
                    handleTagChange(index, tag.tagId, e.target.value)
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                  }}
                />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default DynamicValues;
