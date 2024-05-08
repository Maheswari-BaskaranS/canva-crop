import React, { useEffect, useState, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CForm,
  CCard,
  CCardBody,
  CCardHeader,
  CTableBody,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCardFooter,
  Modal,
  Button,
  Form,
} from "@coreui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useLocation } from "react-router-dom";
import { individualUpdate } from "./services/cropDynamicAPI/individualUpdate";
import { createIndividualImage } from "./services/cropDynamicAPI/createIndividualImage";
import { createMasterImage } from "./services/MainImageAPI/createMasterImage";

const DynamicValues = () => {
  const location = useLocation();
  // Check if location.state exists before destructure its properties

  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentCroppedImageIndex, setCurrentCroppedImageIndex] =
    useState(null); // New state for current cropped image index
  const [croppedImages, setCroppedImages] = useState([]);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [individualDetails, setIndividualDetails] = useState([]);
  const [name, setName] = useState("");
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
  const [formData, setFormData] = useState({
    id: "",
    mainImageId: "",
    mainImage: "",
    axisX: "",
    axisY: "",
    width: "",
    height: "",
    tags: "",
    color: "",
    fabric: "",
    croppedImage: "",
    mainArticleName: "",
    // Add other fields as needed
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleNameChange = (fieldName, value) => {
    setFormData({
        ...formData,
        [fieldName]: value
    });
};

  const handleSaveCreate = async () => {
    const payload ={
      noOfCrops:croppedImages.length,
      file:setImages,
      mainArticleName:setName,
    }
    createMasterImage(payload)
    handleIndividalCreate();
  };

  const handleIndividalCreate = async () => {
    try {
      if (croppedImages.length === 0) {
        throw new Error("No cropped images to save");
      }

      const payload = croppedImages.map((imageArray, index) => {
        return imageArray.map(async (croppedImage, idx) => {
          // Fetch image data from URL
          const response = await fetch(croppedImage.url);
          const blob = await response.blob();

          // Create a new File object from blob data
          const file = new File([blob], `cropped_image_${index}_${idx}.png`, {
            type: "image/png",
          });

          return {
            mainImageId: idx, // Include mainImageId from formData
            axisX: croppedImage.x,
            axisY: croppedImage.y,
            width: croppedImage.width,
            height: croppedImage.height,
            tags: croppedImage.tagName, // Include tags from cropped image
            color: croppedImage.color, // Include color from cropped image
            fabric: croppedImage.fabric, // Include fabric from cropped image
            file: file,
          };
        });
      });

      // Flatten the payload array to have all individual image details in one array
      const flattenedPayload = payload.flat();

      // Example of sending the payload to createIndividualImage function
      const responses = await Promise.all(
        flattenedPayload.map(createIndividualImage)
      );
      console.log(responses); // Log the responses
      navigate("/", { state: { individualImageData: responses } });
    } catch (error) {
      console.error("Error creating individual image:", error);
    }
  };
  /*   const handleSaveCreate = async () => {
    navigate("/");
  }; */
  const handleSaveEdit = async () => {
    try {
      if (!formData.id || typeof formData.id !== "number") {
        throw new Error('"id" must be a number');
      }
      if (!formData.mainImageId) {
        throw new Error('"mainImageId" is required');
      }

      const payload = {
        /*  id: formData.id,
        
        mainImage: formData.mainImage, */
        mainImageId: formData.mainImageId,
        axisX: formData.axisX,
        axisY: formData.axisY,
        width: formData.width,
        height: formData.height,
        tags: formData.tags,
        color: formData.color,
        fabric: formData.fabric,
        croppedImage: formData.croppedImage,
      };

      const response = await individualUpdate(formData.id, payload);
      console.log(response);
    } catch (error) {
      console.error("Error editing individual image:", error);
    }
  };

  /*   
  const handleSaveCreate = async () => {
    try {
      // Call the createIndividualImage function with the form data
      const response = await createIndividualImage(formData);
      console.log(response); // Log the response
      // Optionally, you can perform any additional actions after successful creation
    } catch (error) {
      console.error("Error creating individual image:", error);
      // Handle error if needed
    }
  }; */

  useEffect(() => {
    console.log("Location state:", location.state);
    // Retrieve data from location.state when the component mounts

    const { type, id, detail } = location.state || {};
    console.log("Type:", type);
    console.log("Updated data:", detail);
    if (type === "edit" && detail) {
      console.log("Setting form data...");
      setFormData({
        id: id,
        mainImageId: detail.mainImageId || "", // Provide default value if mainImageId is undefined
        mainImage: detail.mainImage || "",
        axisX: detail.axisX || "",
        axisY: detail.axisY || "",
        width: detail.width || "",
        height: detail.height || "",
        tags: detail.tags || "",
        color: detail.color || "",
        fabric: detail.fabric || "",
        croppedImage: detail.croppedImage || "",
        // Add other fields as needed
      });
    }
  }, [location.state]);

  const drawCroppedImage = (
    imageIndex,
    croppedImageIndex,
    x,
    y,
    width,
    height
  ) => {
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
    if (!cropStart || e.buttons !== 1) return;
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
    const imageData = canvas.toDataURL("image/png");

    setCroppedImages((prevCroppedImages) => {
      const newCroppedImages = [...prevCroppedImages];
      newCroppedImages[index] = [
        ...(prevCroppedImages[index] || []),
        {
          id: index + 1,
          url: croppedImageUrl,
          x: startX,
          y: startY,
          width,
          height,
        },
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

  /*  const handleTagChange = (croppedImageIndex, tagId, newText) => {
    const updatedTags = tags.map((tag) => {
      if (tag.index === croppedImageIndex && tag.tagId === tagId) {
        return { ...tag, text: newText };
      }
      return tag;
    });
    setTags(updatedTags);
  }; */
  const handleTagChange = (croppedImageIndex, tagId, fieldName, newValue) => {
    setCroppedImages((prevCroppedImages) => {
      const updatedImages = [...prevCroppedImages];
      updatedImages[currentImageIndex][croppedImageIndex] = {
        ...updatedImages[currentImageIndex][croppedImageIndex],
        [fieldName]: newValue,
      };
      return updatedImages;
    });
  };
  return (
    <CCard>
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
            onClick={() => {
              if (location.state?.type === "edit") {
                handleSaveEdit();
              } else {
                handleSaveCreate();
              }
            }}
          >
            Save
          </button>
        </div>

        <h1>
          {location.state?.type === "edit" ? "Edit Image" : "Create Image"}
        </h1>
      </CCardHeader>
      <CCardBody>
        {location.state?.type === "edit" ? (
          <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
            <CTableHead style={{ paddingTop: "20px" }}>
              <CTableRow style={{ backgroundColor: "#0096FF" }}>
                {/*  <CTableHeaderCell>Id</CTableHeaderCell>
      <CTableHeaderCell>MainImageId</CTableHeaderCell> */}
                <CTableHeaderCell>Cropped Image</CTableHeaderCell>
                <CTableHeaderCell>X</CTableHeaderCell>
                <CTableHeaderCell>Y</CTableHeaderCell>
                <CTableHeaderCell>Width</CTableHeaderCell>
                <CTableHeaderCell>Height</CTableHeaderCell>
                <CTableHeaderCell>TagName</CTableHeaderCell>
                <CTableHeaderCell>Color</CTableHeaderCell>
                <CTableHeaderCell>Fabric</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                {/*    <CTableDataCell>{formData.id}</CTableDataCell>
   <CTableDataCell>{formData.mainImageId}</CTableDataCell> */}
                <CTableDataCell>
                  <img src={formData.croppedImage} />
                </CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    name="axisX"
                    value={formData.axisX}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  {" "}
                  <input
                    type="text"
                    name="axisY"
                    value={formData.axisY}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  {" "}
                  <input
                    type="text"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleInputChange}
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        ) : (
          <div>
            <input type="file" onChange={handleFileChange} multiple />
          </div>
        )}
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
                <button onClick={() => handleCrop(index)}>
                  Crop Selection
                </button>
                <button onClick={() => handleCroppedImage(index)}>
                  Cropped Image
                </button>
              </div> 
              <div>
            <input
                type="text"
                placeholder="Article name"
                onChange={(e) => handleNameChange("mainArticleName", e.target.value)}
                value={formData.mainArticleName}
            />
            <label>Article Name</label>
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
                    <CTableHeaderCell>Main Image Name</CTableHeaderCell>
                    {/*  <CTableHeaderCell>Edit</CTableHeaderCell>
                    <CTableHeaderCell>Delete</CTableHeaderCell> */}
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
                              "tagName", // Specify the field name
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
                              "color", // Specify the field name
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
                              "fabric", // Specify the field name
                              e.target.value
                            )
                          }
                          value={croppedImage.fabric}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{croppedImage.mainArticleName}</CTableDataCell>
                      {/*  <CTableDataCell>
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
                      </CTableDataCell> */}
                      {/*  <CTableDataCell>
                        <ModeEditOutlineIcon onClick={() => handleEditClick(idx)} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <DeleteIcon onClick={() => handleDelClick(croppedImage.id)} />
                      </CTableDataCell> */}
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
