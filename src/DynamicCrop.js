import React, { useState, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CCardFooter, Modal, Button, Form } from "@coreui/react";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useLocation } from 'react-router-dom';
import { individualUpdate } from "./services/cropDynamicAPI/individualUpdate";

const DynamicValues = () => {
  const location = useLocation();
  const { type, id, updatedData } = location.state;
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentCroppedImageIndex, setCurrentCroppedImageIndex] = useState(null); // New state for current cropped image index
  const [croppedImages, setCroppedImages] = useState([]);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [individualDetails, setIndividualDetails] = useState([])
  const imageRefs = useRef([]);
  const canvasRefs = useRef([]);
  const generateUniqueId = () => {
    return Date.now();
  };
  const [editModalOpen, setEditModalOpen] = useState(false); // State to manage edit modal visibility
  const [editFormData, setEditFormData] = useState({
    x: "",
    y: "",
    width: "",
    height: "",
    tagName: "",
    color: "",
    fabric: "",
  });

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map(() => []);
    const newImageRefs = Array.from(files).map(() => createRef());
    const newCanvasRefs = Array.from(files).map(() => createRef());

    setImages((prevImages) => [...prevImages, ...newImages]);
    imageRefs.current = [...imageRefs.current, ...newImageRefs];
    canvasRefs.current = [...canvasRefs.current, ...newCanvasRefs];
    setCurrentImageIndex(images.length); // Select the newly added image

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = () => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[images.length + index] = reader.result;
          return updatedImages;
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleEditClick = (croppedImageIndex) => {
    setCurrentImageIndex(currentImageIndex); // Set the current image index
    setCurrentCroppedImageIndex(croppedImageIndex);
    const croppedImage = croppedImages[currentImageIndex][croppedImageIndex];

    // Set the edit form data with the current cropped image details
    setEditFormData({
      x: croppedImage.x,
      y: croppedImage.y,
      width: croppedImage.width,
      height: croppedImage.height,
      tagName: croppedImage.tagName,
      color: croppedImage.color,
      fabric: croppedImage.fabric,
    });

    // Open the edit modal
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    // Retrieve the edited information from the state
    const { x, y, width, height, tagName, color, fabric } = editFormData;

    // Update the cropped image in the state with the edited information
    setCroppedImages((prevCroppedImages) => {
      const updatedCroppedImages = [...prevCroppedImages];
      const editedImage = {
        ...prevCroppedImages[currentImageIndex][currentCroppedImageIndex],
        x,
        y,
        width,
        height,
        tagName,
        color,
        fabric,
      };
      updatedCroppedImages[currentImageIndex][currentCroppedImageIndex] = editedImage;
      return updatedCroppedImages;
    });

    drawCroppedImage(currentImageIndex, currentCroppedImageIndex, x, y, width, height);

    // Close the edit modal
    setEditModalOpen(false);
  };
  const handleSave = async () => {
    try {
      // Call the individualUpdate function to update the individual image details
      const response = await individualUpdate(id, updatedData);
  
      console.log(response); // Log the response
      // Optionally, you can perform any additional actions after successful update
    } catch (error) {
      console.error("Error updating individual image:", error);
      // Handle error if needed
    }
  };
  
  const drawCroppedImage = (imageIndex, croppedImageIndex, x, y, width, height) => {
    const canvas = canvasRefs.current[imageIndex].current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
  
    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw the cropped image with the updated dimensions
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    };
  
    // Set the image source to the cropped image URL
    image.src = croppedImages[imageIndex][croppedImageIndex].url;
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    // Update the edit form data state with the changed value
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDelClick = async (id) => {
    try {
      // Your delete functionality here
    } catch (error) {
      console.error("Error deleting individual image:", error);
      // Handle error if needed
    }
  };

  const handleOriginalImage = () => {
    setCroppedImages((prevCroppedImages) =>
      prevCroppedImages.filter((_, i) => i !== currentImageIndex)
    );
    setCropStart(null);
    setCropEnd(null);
    setTags([]);
  };

  const handleCroppedImage = (index) => {
    setCurrentImageIndex(index);
    setCurrentCroppedImageIndex(null); // Reset current cropped image index
    redrawCropSelections(index); // Redraw crop selections for the selected image
    setCropStart(null);
    setCropEnd(null);
    setTags([]);
  };

  const handleCropStart = (e, index) => {
    e.preventDefault();
    setCurrentImageIndex(index);
    setCurrentCroppedImageIndex(null); // Reset current cropped image index
    const rect = imageRefs.current[index].current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropStart({ x, y });
  };

  const handleCropMove = (e, index) => {
    if (!cropStart) return;
    setCurrentImageIndex(index);
    setCurrentCroppedImageIndex(null); // Reset current cropped image index
    const rect = imageRefs.current[index].current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropEnd({ x, y });
    drawCropSelection(index); // Draw crop selection for the selected image
  };

  const drawCropSelection = (index) => {
    const ctx = canvasRefs.current[index].current.getContext("2d");
    const rect = imageRefs.current[index].current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

    canvasRefs.current[index].current.width = naturalWidth;
    canvasRefs.current[index].current.height = naturalHeight;

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

  const redrawCropSelections = (index) => {
    croppedImages[index]?.forEach((croppedImage) => {
      const ctx = canvasRefs.current[index].current.getContext("2d");
      const rect = imageRefs.current[index].current.getBoundingClientRect();
      const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

      const startX = croppedImage.x;
      const startY = croppedImage.y;
      const width = croppedImage.width;
      const height = croppedImage.height;

      ctx.strokeStyle = "#FF033E";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, width, height);
    });
  };

  const handleCropEnd = () => {
    drawCropSelection(currentImageIndex); // Draw crop selection for the selected image
  };

  const handleCrop = (index) => {
    setCurrentImageIndex(index);
    setCurrentCroppedImageIndex(null); // Reset current cropped image index
    if (!cropStart || !cropEnd) return;

    const rect = imageRefs.current[index].current.getBoundingClientRect();
    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    const uniqueId = generateUniqueId();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      imageRefs.current[index].current,
      (startX / rect.width) * naturalWidth,
      (startY / rect.height) * naturalHeight,
      (width / rect.width) * naturalWidth,
      (height / rect.height) * naturalHeight,
      0,
      0,
      width,
      height
    );

    const croppedImageUrl = canvas.toDataURL();

    setCroppedImages((prevCroppedImages) => {
      const newCroppedImages = [...prevCroppedImages];
      newCroppedImages[index] = [
        ...(prevCroppedImages[index] || []),
        { id:index+1,url: croppedImageUrl, x: startX, y: startY, width, height },
      ];
      return newCroppedImages;
    });

    setCropStart(null);
    setCropEnd(null);
  };

  const handleChange = () => {
    navigate("/");
  };

  const handleTagClick = (e, croppedImageIndex) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tagId = Date.now();

    setTags((prevTags) => [
      ...prevTags,
      { x, y, text: tagText, index: croppedImageIndex, tagId },
    ]);
    setTagText("");
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
    
    <CCard>
      <div>
      <h1>{type === 'edit' ? 'Edit Image' : 'Create Image'}</h1>
      <p>ID: {id}</p>
      {type === 'edit' && (
        <div>
          <p>Main Image ID: {updatedData.mainImageId}</p>
          <p>Main Image:{updatedData.mainImage}</p>
          <p>Axis X: {updatedData.axisX}</p>
          <p>Axis Y: {updatedData.axisY}</p>
          <p>Width: {updatedData.width}</p>
          <p>Height: {updatedData.height}</p>
          <p>Tags: {updatedData.tags}</p>
          <p>Color: {updatedData.color}</p>
          <p>Fabric: {updatedData.fabric}</p>
          {/* Add other fields as needed */}
        </div>
      )}
    </div>
      <CCardHeader>
        <div style={{ paddingTop: "20px", paddingLeft: "1070px" }}>
          <button
            style={{
              height: "35px",
              width: "200px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={handleChange}
          >
            Save
          </button>
        </div>
      </CCardHeader>
      <CCardBody>
        <input type="file" onChange={handleFileChange} multiple />
        <CRow>
          {images.map((imageSrc, index) => (
            <CCol key={index}>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                <img
                  ref={imageRefs.current[index]}
                  src={imageSrc}
                  alt={`Selected Image ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    cursor: "crosshair",
                  }}
                  onMouseDown={(e) => handleCropStart(e, index)}
                  onMouseMove={(e) => handleCropMove(e, index)}
                  onMouseUp={handleCropEnd}
                  onMouseLeave={handleCropEnd}
                  onDragStart={(e) => e.preventDefault()}
                />
                <canvas
                  ref={canvasRefs.current[index]}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                  }}
                />
                <button onClick={() => handleCrop(index)}>Crop Selection</button>
                <button onClick={() => handleCroppedImage(index)}>Cropped Image</button>
              </div>
              <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
                <CTableHead style={{ paddingTop: "20px" }}>
                  <CTableRow style={{ backgroundColor: "#0096FF" }}>
                    <CTableHeaderCell>Cropped Image</CTableHeaderCell>
                    <CTableHeaderCell>X</CTableHeaderCell>
                    <CTableHeaderCell>Y</CTableHeaderCell>
                    <CTableHeaderCell>Width</CTableHeaderCell>
                    <CTableHeaderCell>Height</CTableHeaderCell>
                    <CTableHeaderCell>TagName</CTableHeaderCell>
                    <CTableHeaderCell>Color</CTableHeaderCell>
                    <CTableHeaderCell>Fabric</CTableHeaderCell>
                    <CTableHeaderCell>Edit</CTableHeaderCell>
                    <CTableHeaderCell>Delete</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <tbody>
                  {croppedImages[index]?.map((croppedImage, idx) => (
                    <CTableRow
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#D3D3D3" : "",
                      }}
                    >
                      <CTableDataCell>
                        <img
                          src={croppedImage.url}
                          alt={`Cropped Image ${idx + 1}`}
                          onClick={() => setCurrentCroppedImageIndex(idx)} // Set current cropped image index on click
                          style={{ cursor: "crosshair" }}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{croppedImage.x}</CTableDataCell>
                      <CTableDataCell>{croppedImage.y}</CTableDataCell>
                      <CTableDataCell>{croppedImage.width}</CTableDataCell>
                      <CTableDataCell>{croppedImage.height}</CTableDataCell>
                      <CTableDataCell>
                        <input
                          type="text"
                          placeholder="Tag Name"
                          onChange={(e) =>
                            handleTagChange(
                              idx,
                              croppedImage.tagId,
                              e.target.value
                            )
                          }
                          value={croppedImage.tagName}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <input
                          type="text"
                          placeholder="Color"
                          onChange={(e) =>
                            handleTagChange(
                              idx,
                              croppedImage.tagId,
                              e.target.value
                            )
                          }
                          value={croppedImage.color}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <input
                          type="text"
                          placeholder="Fabric"
                          onChange={(e) =>
                            handleTagChange(
                              idx,
                              croppedImage.tagId,
                              e.target.value
                            )
                          }
                          value={croppedImage.fabric}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <ModeEditOutlineIcon onClick={() => handleEditClick(idx)} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <DeleteIcon onClick={() => handleDelClick(croppedImage.id)} />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </tbody>
              </CTable>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
      <CCardFooter></CCardFooter>
    </CCard>
  );
};

export default DynamicValues;

// import React, { useState, useRef, createRef } from "react";
// import { Button, Modal, Form} from 'react-bootstrap';
// import {
//   CCard,
//   CCardBody,
//   CRow,
//   CCol,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
//   CCardFooter,
//   CCardHeader,
// } from "@coreui/react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
// import {deleteIndividualImage} from './services/cropDynamicAPI/deleteIndividualImage';

// import { useNavigate } from "react-router-dom";

// const DynamicValues = () => {
//   const navigate = useNavigate();
//   const [images, setImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);
//   const [currentCroppedImageIndex, setCurrentCroppedImageIndex] = useState(null); // New state for current cropped image index
//   const [croppedImages, setCroppedImages] = useState([]);
//   const [cropStart, setCropStart] = useState(null);
//   const [cropEnd, setCropEnd] = useState(null);
//   const [tags, setTags] = useState([]);
//   const [tagText, setTagText] = useState("");
//   const [individualDetails, setIndividualDetails] = useState([])
//   const imageRefs = useRef([]);
//   const canvasRefs = useRef([]);
//   const generateUniqueId = () => {
//     return Date.now();
//   };
//   const [editModalOpen, setEditModalOpen] = useState(false); // State to manage edit modal visibility
//   const [editFormData, setEditFormData] = useState({
//     x: "",
//     y: "",
//     width: "",
//     height: "",
//     tagName: "",
//     color: "",
//     fabric: "",
//   });

//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     const newImages = Array.from(files).map(() => []);
//     const newImageRefs = Array.from(files).map(() => createRef());
//     const newCanvasRefs = Array.from(files).map(() => createRef());

//     setImages((prevImages) => [...prevImages, ...newImages]);
//     imageRefs.current = [...imageRefs.current, ...newImageRefs];
//     canvasRefs.current = [...canvasRefs.current, ...newCanvasRefs];
//     setCurrentImageIndex(images.length); // Select the newly added image

//     Array.from(files).forEach((file, index) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         setImages((prevImages) => {
//           const updatedImages = [...prevImages];
//           updatedImages[images.length + index] = reader.result;
//           return updatedImages;
//         });
//       };

//       reader.readAsDataURL(file);
//     });
//   };
// /*   const handleEditClick = (croppedImageIndex) => {
//     // You can implement your edit functionality here, such as displaying a modal with editing options
//     console.log("Edit clicked for cropped image at index:", croppedImageIndex);
//   }; */

//   const handleEditClick = (croppedImageIndex) => {
//     // Retrieve the cropped image based on the index
//     setCurrentImageIndex(currentImageIndex); // Set the current image index
//     setCurrentCroppedImageIndex(croppedImageIndex);
//     const croppedImage = croppedImages[currentImageIndex][croppedImageIndex];

//     // Set the edit form data with the current cropped image details
//     setEditFormData({
//       x: croppedImage.x,
//       y: croppedImage.y,
//       width: croppedImage.width,
//       height: croppedImage.height,
//       tagName: croppedImage.tagName,
//       color: croppedImage.color,
//       fabric: croppedImage.fabric,
//     });

//     // Open the edit modal
//     setEditModalOpen(true);
//   };

  
//   const handleSaveEdit = () => {
//     // Retrieve the edited information from the state
//     const { x, y, width, height, tagName, color, fabric } = editFormData;

//     // Update the cropped image in the state with the edited information
//     setCroppedImages((prevCroppedImages) => {
//       const updatedCroppedImages = [...prevCroppedImages];
//       const editedImage = {
//         ...prevCroppedImages[currentImageIndex][currentCroppedImageIndex],
//         x,
//         y,
//         width,
//         height,
//         tagName,
//         color,
//         fabric,
//       };
//       updatedCroppedImages[currentImageIndex][currentCroppedImageIndex] = editedImage;
//       return updatedCroppedImages;
//     });

//     drawCroppedImage(currentImageIndex, currentCroppedImageIndex, x, y, width, height);

//     // Close the edit modal
//     setEditModalOpen(false);
//   };
//   const drawCroppedImage = (imageIndex, croppedImageIndex, x, y, width, height) => {
//     const canvas = canvasRefs.current[imageIndex].current;
//     const ctx = canvas.getContext("2d");
//     const image = new Image();
  
//     image.onload = () => {
//       // Clear the canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       // Draw the cropped image with the updated dimensions
//       ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
//     };
  
//     // Set the image source to the cropped image URL
//     image.src = croppedImages[imageIndex][croppedImageIndex].url;
//   };
//   const handleEditFormChange = (e) => {
//     const { name, value } = e.target;
//     // Update the edit form data state with the changed value
//     setEditFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleDelClick = async (id) => {
//     try {
//       const response = await deleteIndividualImage(id);
//       console.log("Individual image deleted successfully:", response);
      
//       // Remove the deleted individual image from the state
//       setCroppedImages((prevCroppedImages) => {
//         return prevCroppedImages.map((imageCrops, index) => {
//           // Filter out the deleted image based on its ID
//           return imageCrops.filter((croppedImage) => croppedImage.id !== id);
//         });
//       });
//     } catch (error) {
//       console.error("Error deleting individual image:", error);
//       // Handle error if needed
//     }
//   };
  
  
//   const handleOriginalImage = () => {
//     setCroppedImages((prevCroppedImages) =>
//       prevCroppedImages.filter((_, i) => i !== currentImageIndex)
//     );
//     setCropStart(null);
//     setCropEnd(null);
//     setTags([]);
//   };

//   const handleCroppedImage = (index) => {
//     setCurrentImageIndex(index);
//     setCurrentCroppedImageIndex(null); // Reset current cropped image index
//     redrawCropSelections(index); // Redraw crop selections for the selected image
//     setCropStart(null);
//     setCropEnd(null);
//     setTags([]);
//   };

//   const handleCropStart = (e, index) => {
//     e.preventDefault();
//     setCurrentImageIndex(index);
//     setCurrentCroppedImageIndex(null); // Reset current cropped image index
//     const rect = imageRefs.current[index].current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setCropStart({ x, y });
//   };

//   const handleCropMove = (e, index) => {
//     if (!cropStart) return;
//     setCurrentImageIndex(index);
//     setCurrentCroppedImageIndex(null); // Reset current cropped image index
//     const rect = imageRefs.current[index].current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setCropEnd({ x, y });
//     drawCropSelection(index); // Draw crop selection for the selected image
//   };

//   const drawCropSelection = (index) => {
//     const ctx = canvasRefs.current[index].current.getContext("2d");
//     const rect = imageRefs.current[index].current.getBoundingClientRect();
//     const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

//     canvasRefs.current[index].current.width = naturalWidth;
//     canvasRefs.current[index].current.height = naturalHeight;

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

//   const redrawCropSelections = (index) => {
//     croppedImages[index]?.forEach((croppedImage) => {
//       const ctx = canvasRefs.current[index].current.getContext("2d");
//       const rect = imageRefs.current[index].current.getBoundingClientRect();
//       const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

//       const startX = croppedImage.x;
//       const startY = croppedImage.y;
//       const width = croppedImage.width;
//       const height = croppedImage.height;

//       ctx.strokeStyle = "#FF033E";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(startX, startY, width, height);
//     });
//   };

//   const handleCropEnd = () => {
//     drawCropSelection(currentImageIndex); // Draw crop selection for the selected image
//   };

//   const handleCrop = (index) => {
//     setCurrentImageIndex(index);
//     setCurrentCroppedImageIndex(null); // Reset current cropped image index
//     if (!cropStart || !cropEnd) return;

//     const rect = imageRefs.current[index].current.getBoundingClientRect();
//     const startX = Math.min(cropStart.x, cropEnd.x);
//     const startY = Math.min(cropStart.y, cropEnd.y);
//     const width = Math.abs(cropEnd.x - cropStart.x);
//     const height = Math.abs(cropEnd.y - cropStart.y);
//     const uniqueId = generateUniqueId();

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const { naturalWidth, naturalHeight } = imageRefs.current[index].current;

//     canvas.width = width;
//     canvas.height = height;

//     ctx.drawImage(
//       imageRefs.current[index].current,
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

//     setCroppedImages((prevCroppedImages) => {
//       const newCroppedImages = [...prevCroppedImages];
//       newCroppedImages[index] = [
//         ...(prevCroppedImages[index] || []),
//         { id:index+1,url: croppedImageUrl, x: startX, y: startY, width, height },
//       ];
//       return newCroppedImages;
//     });

//     setCropStart(null);
//     setCropEnd(null);
//   };

// croppedImages.forEach((imageCrops, index) => {
//   const mainImageId = index + 1
//   console.log(mainImageId)
//   console.log(`Image ${index + 1}: ${imageCrops.length}`);
// });


//   const handleChange = () => {
//     navigate("/");
//   };

//   const handleTagClick = (e, croppedImageIndex) => {
//     const rect = e.target.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const tagId = Date.now();

//     setTags((prevTags) => [
//       ...prevTags,
//       { x, y, text: tagText, index: croppedImageIndex, tagId },
//     ]);
//     setTagText("");
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
//     <CCard>
//        <Modal
//         show={editModalOpen}
//         onHide={() => setEditModalOpen(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Cropped Image</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="editX">
//               <Form.Label>X Coordinate</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="x"
//                 value={editFormData.x}
//                 onChange={handleEditFormChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="editY">
//               <Form.Label>Y Coordinate</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="y"
//                 value={editFormData.y}
//                 onChange={handleEditFormChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="editHeight">
//               <Form.Label>Height</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="height"
//                 value={editFormData.height}
//                 onChange={handleEditFormChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="editWidth">
//               <Form.Label>Width</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="width"
//                 value={editFormData.width}
//                 onChange={handleEditFormChange}
//               />
//             </Form.Group>
//             {/* Add similar Form.Group elements for other fields */}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSaveEdit}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <CCardHeader>
//         <div style={{ paddingTop: "20px", paddingLeft: "1070px" }}>
//           <button
//             style={{
//               height: "35px",
//               width: "200px",
//               borderRadius: "2rem",
//               border: "#0096FF",
//               backgroundColor: "#0096FF",
//               color: "white",
//               fontWeight: "bold",
//               fontSize: "16px",
//             }}
//             onClick={handleChange}
//           >
//             Save
//           </button>
//         </div>
//       </CCardHeader>
//       <CCardBody>
//         <input type="file" onChange={handleFileChange} multiple />
//         <CRow>
//           {images.map((imageSrc, index) => (
//             <CCol key={index}>
//               <div
//                 style={{
//                   position: "relative",
//                   display: "inline-block",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <img
//                   ref={imageRefs.current[index]}
//                   src={imageSrc}
//                   alt={`Selected Image ${index + 1}`}
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "400px",
//                     cursor: "crosshair",
//                   }}
//                   onMouseDown={(e) => handleCropStart(e, index)}
//                   onMouseMove={(e) => handleCropMove(e, index)}
//                   onMouseUp={handleCropEnd}
//                   onMouseLeave={handleCropEnd}
//                   onDragStart={(e) => e.preventDefault()}
//                 />
//                 <canvas
//                   ref={canvasRefs.current[index]}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     pointerEvents: "none",
//                   }}
//                 />
//                 <button onClick={() => handleCrop(index)}>Crop Selection</button>
//                 <button onClick={() => handleCroppedImage(index)}>Cropped Image</button>
//               </div>
//               <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
//                 <CTableHead style={{ paddingTop: "20px" }}>
//                   <CTableRow style={{ backgroundColor: "#0096FF" }}>
//                     <CTableHeaderCell>Cropped Image</CTableHeaderCell>
//                     <CTableHeaderCell>X</CTableHeaderCell>
//                     <CTableHeaderCell>Y</CTableHeaderCell>
//                     <CTableHeaderCell>Width</CTableHeaderCell>
//                     <CTableHeaderCell>Height</CTableHeaderCell>
//                     <CTableHeaderCell>TagName</CTableHeaderCell>
//                     <CTableHeaderCell>Color</CTableHeaderCell>
//                     <CTableHeaderCell>Fabric</CTableHeaderCell>
//                     <CTableHeaderCell>Edit</CTableHeaderCell>
//                     <CTableHeaderCell>Delete</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <tbody>
//                   {croppedImages[index]?.map((croppedImage, idx) => (
//                     <CTableRow
//                       key={idx}
//                       style={{
//                         backgroundColor: idx % 2 === 0 ? "#D3D3D3" : "",
//                       }}
//                     >
//                       <CTableDataCell>
//                         {currentCroppedImageIndex === idx && ( // Only display crop selection for the current cropped image
//                           <img
//                             src={croppedImage.url}
//                             alt={`Cropped Image ${idx + 1}`}
//                             onClick={() => setCurrentCroppedImageIndex(idx)} // Set current cropped image index on click
//                             style={{ cursor: "crosshair" }}
//                           />
//                         )}
//                         <img
//                           src={croppedImage.url}
//                           alt={`Cropped Image ${idx + 1}`}
//                           style={{
//                             cursor: "pointer",
//                             opacity: currentCroppedImageIndex === idx ? 0.3 : 1,
//                           }}
//                         />
//                       </CTableDataCell>
//                       <CTableDataCell>{croppedImage.x}</CTableDataCell>
//                       <CTableDataCell>{croppedImage.y}</CTableDataCell>
//                       <CTableDataCell>{croppedImage.width}</CTableDataCell>
//                       <CTableDataCell>{croppedImage.height}</CTableDataCell>
//                       <CTableDataCell>
//                         <input
//                           type="text"
//                           placeholder="Tag Name"
//                           onChange={(e) =>
//                             handleTagChange(
//                               idx,
//                               croppedImage.tagId,
//                               e.target.value
//                             )
//                           }
//                           value={croppedImage.tagName}
//                         />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <input
//                           type="text"
//                           placeholder="Color"
//                           onChange={(e) =>
//                             handleTagChange(
//                               idx,
//                               croppedImage.tagId,
//                               e.target.value
//                             )
//                           }
//                           value={croppedImage.color}
//                         />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <input
//                           type="text"
//                           placeholder="Fabric"
//                           onChange={(e) =>
//                             handleTagChange(
//                               idx,
//                               croppedImage.tagId,
//                               e.target.value
//                             )
//                           }
//                           value={croppedImage.fabric}
//                         />
//                       </CTableDataCell>
                     
//                       <CTableDataCell>
//   <ModeEditOutlineIcon onClick={() => handleEditClick(idx)} />
// </CTableDataCell>

//                       <CTableDataCell>
//                         <DeleteIcon onClick={() => handleDelClick(croppedImage.id)} />
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </tbody>
//               </CTable>
//             </CCol>
//           ))}
//         </CRow>
//       </CCardBody>
//       <CCardFooter></CCardFooter>
//     </CCard>
//   );
// };

// export default DynamicValues; 

// import React, { useState, useRef } from "react";
// import {
//   CCard,
//   CCardBody,
//   CRow,
//   CCol,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
// } from "@coreui/react";
// import DeleteIcon from '@mui/icons-material/Delete';
// import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

// const DynamicValues = () => {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [originalImageSrc, setOriginalImageSrc] = useState(null);
//   const [croppedImages, setCroppedImages] = useState([]);
//     const [allCroppedImages, setAllCroppedImages] = useState([]);
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
//       setOriginalImageSrc(reader.result);
//       setCropStart(null);
//       setCropEnd(null);
//       setTags([]);
//       setCroppedImages([]);
//     };

//     reader.readAsDataURL(file);
//   };

// /*   const handleOriginalImage = () => {
//     setImageSrc(originalImageSrc);
//     setCropStart(null);
//     setCropEnd(null);
//     setTags([]);
//     setCroppedImages([]);
//   }; */
  
//   const handleOriginalImage = () => {
//     setImageSrc(originalImageSrc); // Display original image
//   };
//   const handleCroppedImage = () => {
//     setImageSrc(originalImageSrc); // Display original image
//     redrawCropSelections(); // Redraw crop selections
//     setCropStart(null);
//     setCropEnd(null);
//     setTags([]);
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
//     const { naturalWidth, naturalHeight } = imageRef.current;

//     canvasRef.current.width = naturalWidth;
//     canvasRef.current.height = naturalHeight;

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

//   const redrawCropSelections = () => {
//     croppedImages.forEach((croppedImage) => {
//       const ctx = canvasRef.current.getContext("2d");
//       const rect = imageRef.current.getBoundingClientRect();
//       const { naturalWidth, naturalHeight } = imageRef.current;

//       const startX = croppedImage.x;
//       const startY = croppedImage.y;
//       const width = croppedImage.width;
//       const height = croppedImage.height;

//       ctx.strokeStyle = "#FF033E";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(startX, startY, width, height);
//     });
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

//     setCroppedImages([
//       ...croppedImages,
//       { url: croppedImageUrl, x: startX, y: startY, width, height },
//     ]);

//     setCropStart(null);
//     setCropEnd(null);
//   };

//   const handleTagClick = (e, croppedImageIndex) => {
//     console.log("Clicked on cropped image index:", croppedImageIndex);
//     const rect = e.target.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const tagId = Date.now();

//     setTags([
//       ...tags,
//       { x, y, text: tagText, index: croppedImageIndex, tagId },
//     ]);
//     setTagText("");
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
//     <CCard>
//       <CCardBody>
//         <input type="file" onChange={handleFileChange} />
//         {imageSrc && (
//           <>
//             <CRow>
//               <CCol>
//                 <div
//                   style={{
//                     position: "relative",
//                     display: "inline-block",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <img
//                     ref={imageRef}
//                     src={imageSrc}
//                     alt="Selected Image"
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "400px",
//                       cursor: "crosshair",
//                     }}
//                     onMouseDown={handleCropStart}
//                     onMouseMove={handleCropMove}
//                     onMouseUp={handleCropEnd}
//                     onMouseLeave={handleCropEnd}
//                     onDragStart={(e) => e.preventDefault()}
//                   />
//                   <canvas
//                     ref={canvasRef}
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       pointerEvents: "none"
//                     }}
//                   />
//                   <button onClick={handleCrop}>Crop Selection</button>
//                   <button onClick={handleOriginalImage}>Original Image</button>
//                   <button onClick={handleCroppedImage}>Cropped Image</button>
//                 </div>
//               </CCol>
//             </CRow>
//             <CRow >
//               <CCol>
//                 <CTable
//                   style={{ borderCollapse: "collapse", width: "100%" }}
//                 >
//                   <CTableHead style={{paddingTop:"20px"}}>
//                     <CTableRow style={{backgroundColor:"#0096FF"}}>
//                       <CTableHeaderCell>Cropped Image</CTableHeaderCell>
//                       <CTableHeaderCell>X</CTableHeaderCell>
//                       <CTableHeaderCell>Y</CTableHeaderCell>
//                       <CTableHeaderCell>Width</CTableHeaderCell>
//                       <CTableHeaderCell>Height</CTableHeaderCell>
//                       <CTableHeaderCell>TagName</CTableHeaderCell>
//                       <CTableHeaderCell>Color</CTableHeaderCell>
//                       <CTableHeaderCell>Fabric</CTableHeaderCell>
//                       <CTableHeaderCell>Edit</CTableHeaderCell>
//                       <CTableHeaderCell>Delete</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <tbody>
//                     {croppedImages.map((croppedImage, index) => (
//                       <CTableRow key={index}    style={{
//                         backgroundColor: index % 2 === 0 ? "#D3D3D3" : "",
//                       }}>
//                         <CTableDataCell>
//                           <img
//                             src={croppedImage.url}
//                             alt={`Cropped Image ${index + 1}`}
//                             onClick={(e) => handleTagClick(e, index)}
//                             style={{ cursor: "crosshair" }}
//                           />
//                         </CTableDataCell>
//                         <CTableDataCell>{croppedImage.x}</CTableDataCell>
//                         <CTableDataCell>{croppedImage.y}</CTableDataCell>
//                         <CTableDataCell>{croppedImage.width}</CTableDataCell>
//                         <CTableDataCell>{croppedImage.height}</CTableDataCell>
//                         <CTableDataCell>
//                           <input
//                             type="text"
//                             placeholder="Tag Name"
//                             onChange={(e) =>
//                               handleTagChange(
//                                 index,
//                                 croppedImage.tagId,
//                                 e.target.value
//                               )
//                             }
//                             value={croppedImage.tagName}
//                           />
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <input
//                             type="text"
//                             placeholder="Color"
//                             onChange={(e) =>
//                               handleTagChange(
//                                 index,
//                                 croppedImage.tagId,
//                                 e.target.value
//                               )
//                             }
//                             value={croppedImage.color}
//                           />
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <input
//                             type="text"
//                             placeholder="Fabric"
//                             onChange={(e) =>
//                               handleTagChange(
//                                 index,
//                                 croppedImage.tagId,
//                                 e.target.value
//                               )
//                             }
//                             value={croppedImage.fabric}
//                           />
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <ModeEditOutlineIcon/>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <DeleteIcon/>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                   </tbody>
//                 </CTable>
//               </CCol>
//             </CRow>
//           </>
//         )}
//       </CCardBody>
//     </CCard>
//   );
// };

// export default DynamicValues;




