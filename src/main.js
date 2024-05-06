import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { getAllMasterImages } from "./services/MainImageAPI/getAllMasterImages ";
import { individualgetall } from "./services/cropDynamicAPI/individualgetall";
import { deleteMasterImage } from "./services/MainImageAPI/deleteMasterImage";
import { deleteIndividualImage } from "./services/cropDynamicAPI/deleteIndividualImage";
import { individualgetbyId } from "./services/cropDynamicAPI/individualId";
import { individualUpdate } from "./services/cropDynamicAPI/individualUpdate";
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CCardHeader,
} from "@coreui/react";
import EditIndividualImage from "./EditIndividualImage";
// Define EditIndividualImage component here

const Main = () => {
  const [type, setType] = useState('');
  const navigate = useNavigate();
  const [showMasterTable, setShowMasterTable] = useState(true);
  const [showIndividualTable, setShowIndividualTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterImageDetails, setMasterImageDetails] = useState([]);
  const [individualDetails, setIndividualDetails] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    const fetchMasterImages = async () => {
      try {
        const data = await getAllMasterImages();
        setMasterImageDetails(data);
      } catch (error) {
        console.error("Error fetching master images:", error);
      }
    };

    fetchMasterImages();
  }, []);

  useEffect(() => {
    const fetchIndividualImages = async () => {
      try {
        const data = await individualgetall();
        setIndividualDetails(data);
      } catch (error) {
        console.error("Error fetching master images:", error);
      }
    };

    fetchIndividualImages();
  }, []);

  const handleMasterClick = () => {
    setShowMasterTable(true);
    setShowIndividualTable(false);
  };

  const handleIndividualClick = () => {
    setShowMasterTable(false);
    setShowIndividualTable(true);
  };

  const handleChange = () => {
    setType('create'); 
    navigate("/dynamic-crop", { state: { type:'create' } });
  };

  const fetchIndividualDetailsById = async (id) => {
    try {
      const data = await individualgetbyId(id);
      return data;
    } catch (error) {
      console.error("Error fetching individual details by ID:", error);
      return null;
    }
  };

  const updateIndividualDetails = async (id, updatedData) => {
    try {
      const response = await individualUpdate(id, updatedData);
      console.log("Individual image updated successfully:", response);
    } catch (error) {
      console.error("Error updating individual image:", error);
    }
  };

/*   const handleIndividualEditClick = async (id) => {
    try {
      const detail = await fetchIndividualDetailsById(id);
      if (!detail) {
        console.error("Individual detail not found");
        return;
      }
  
      setEditing(true);
      setEditedData(detail);
      navigate("/dynamic-crop", { state: { type: 'edit', id, updatedData: detail } });
  
    } catch (error) {
      console.error("Error fetching/updating individual image:", error);
    }
  }; */
  const handleIndividualEditClick = async (id) => {
    try {
      await fetchIndividualDetailsById(id);
      const detail = individualDetails.find((detail) => detail.id === id);
      if (!detail) {
        console.error("Individual detail not found");
        return;
      }
  
      const updatedData = {
        mainImageId: detail.mainImageId,
        mainImage:detail.mainImage,
        axisX: detail.axisX,
        axisY: detail.axisY,
        width: detail.width,
        height: detail.height,
        tags: detail.tags,
        color: detail.color,
        fabric: detail.fabric,
      };
  
      // Navigate to /dynamic-crop with the state object
      navigate("/dynamic-crop", { state: { type: 'edit', id, updatedData } });
    } catch (error) {
      console.error("Error fetching/updating individual image:", error);
    }
  };
  

  const handleDelClick = async (id) => {
    try {
      const response = await deleteIndividualImage(id);
      console.log("Master image deleted successfully:", response);
      setIndividualDetails((prevState) =>
        prevState.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error deleting master image:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await deleteMasterImage(id);
      console.log("Master image deleted successfully:", response);
      setMasterImageDetails((prevState) =>
        prevState.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error deleting master image:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedData(null);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateIndividualDetails(updatedData.id, updatedData);
      console.log("Individual image updated successfully");
      setEditing(false);
      setEditedData(null);
      // Optionally, you can update individualDetails state here
    } catch (error) {
      console.error("Error updating individual image:", error);
    }
  };

  const filteredIndividualDetails = individualDetails.filter((detail) =>
    Object.values(detail).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredMasterDetails = masterImageDetails.filter((detail) =>
    detail.noOfCrops
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <CCard>
      <CCardHeader>
        <div>
          <h2 style={{ color: "#0096FF", paddingLeft: "500px" }}>
            Dynamic Image Selection
          </h2>
        </div>

        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "1100px",
            paddingBottom: "20px",
          }}
        >
          <button
            style={{
              width: "200px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
            }}
            onClick={handleChange}
          >
            <AddIcon style={{ textSize: "50px", color: "#FFFFFF" }} />
          </button>
        </div>
      </CCardHeader>
      <CCardBody>
        <div
          style={{
            paddingLeft: "10PX",
            paddingTop: "20px",
            display: "flex",
            gap: "10px",
            paddingBottom: "20px",
          }}
        >
          <button
            style={{
              width: "300px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
              height: "40px",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "15px",
            }}
            onClick={handleMasterClick}
          >
            Master Image Details
          </button>
          <button
            style={{
              width: "300px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
              height: "40px",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "15px",
            }}
            onClick={handleIndividualClick}
          >
            Individual Image Details
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                borderRadius: "2rem",
                borderColor: "#0096FF",
                marginRight: "5px",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchOutlinedIcon style={{ color: "#0096FF" }} />
          </div>
        </div>

        {showMasterTable && (
          <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
            <CTableHead style={{ paddingTop: "20px" }}>
              <CTableRow
                style={{ backgroundColor: "#0096FF", fontWeight: "bold" }}
              >
                <CTableDataCell>S.No</CTableDataCell>
                <CTableDataCell>Image No</CTableDataCell>
                <CTableDataCell>No of Crops</CTableDataCell>
                <CTableDataCell>Delete</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredMasterDetails.map((detail, index) => (
                <CTableRow
                  key={index}
                  style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}
                >
                  <CTableDataCell
                    style={{ paddingLeft: "25px", verticalAlign: "middle" }}
                  >
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ paddingLeft: "25px", verticalAlign: "middle" }}
                  >
                    {detail.id}{" "}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ paddingLeft: "25px", verticalAlign: "middle" }}
                  >
                    {detail.noOfCrops}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ paddingLeft: "25px", verticalAlign: "middle" }}
                  >
                    <DeleteIcon onClick={() => handleDeleteClick(detail.id)} />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {showIndividualTable && (
          <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
            <CTableHead style={{ paddingTop: "20px" }}>
              <CTableRow style={{ backgroundColor: "#0096FF" }}>
                <CTableHeaderCell>S.No</CTableHeaderCell>
                <CTableHeaderCell>Main Image ID</CTableHeaderCell>
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
            <CTableBody>
              {filteredIndividualDetails.map((detail, index) => (
                <CTableRow
                  key={index}
                  style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}
                >
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.mainImageId}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.axisX}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.axisY}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.width}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.height}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.tags}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.color}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    {detail.fabric}
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    <ModeEditOutlineIcon
                      onClick={() => handleIndividualEditClick(detail.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px" }}>
                    <DeleteIcon onClick={() => handleDelClick(detail.id)} />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {editing && editedData && (
          <EditIndividualImage
            data={editedData}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </CCardBody>
    </CCard>
  );
};

export default Main;


// import React, { useState, useEffect } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import { useNavigate } from "react-router-dom";

// import {
//   CCard,
//   CCardBody,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
//   CTableBody,
//   CCardHeader,
// } from "@coreui/react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import { getAllMasterImages } from "./services/MainImageAPI/getAllMasterImages ";
// import { individualgetall } from "./services/cropDynamicAPI/individualgetall";
// import { deleteMasterImage } from "./services/MainImageAPI/deleteMasterImage";
// import { deleteIndividualImage } from "./services/cropDynamicAPI/deleteIndividualImage";
// import { individualgetbyId } from "./services/cropDynamicAPI/individualId";
// import { individualUpdate } from "./services/cropDynamicAPI/individualUpdate";

// const Main = () => {
//   const navigate = useNavigate();
//   const [showMasterTable, setShowMasterTable] = useState(true);
//   const [showIndividualTable, setShowIndividualTable] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [masterImageDetails, setMasterImageDetails] = useState([]);
//   const [individualDetails, setIndividualDetails] = useState([]);
//   const [selectedIndividual, setSelectedIndividual] = useState(null);
//   const [type, setType] = useState('');

//   useEffect(() => {
//     const fetchMasterImages = async () => {
//       try {
//         const data = await getAllMasterImages();
//         setMasterImageDetails(data);
//       } catch (error) {
//         console.error("Error fetching master images:", error);
//       }
//     };

//     fetchMasterImages();
//   }, []);
//   useEffect(() => {
//     const fetchIndividualImages = async () => {
//       try {
//         const data = await individualgetall();
//         setIndividualDetails(data);
//       } catch (error) {
//         console.error("Error fetching master images:", error);
//       }
//     };

//     fetchIndividualImages();
//   }, []);
//   const handleMasterClick = () => {
//     setShowMasterTable(true);
//     setShowIndividualTable(false);
    
//   };

//   const handleIndividualClick = () => {
//     setShowMasterTable(false);
//     setShowIndividualTable(true);
    
//   };

//   const handleChange = () => {
//     setType('create'); 
//     navigate("/dynamic-crop", { state: { type:'create' } });
//   };
//   // Function to fetch individual image details by ID
//   const fetchIndividualDetailsById = async (id) => {
//     try {
//       const data = await individualgetbyId(id);
//     } catch (error) {
//       console.error("Error fetching individual details by ID:", error);
//     }
//   };

//   // Function to update individual image details
//   const updateIndividualDetails = async (id, updatedData) => {
//     try {
//       const response = await individualUpdate(id, updatedData);
//       console.log("Individual image updated successfully:", response);
//     } catch (error) {
//       console.error("Error updating individual image:", error);
//     }
//   };

//   const handleIndividualEditClick = async (id) => {
//     try {
//       await fetchIndividualDetailsById(id);
//       const detail = individualDetails.find((detail) => detail.id === id);
//       if (!detail) {
//         console.error("Individual detail not found");
//         return;
//       }

//       const updatedData = {
//         mainImageId: detail.mainImageId,
//         axisX: detail.axisX,
//         axisY: detail.axisY,
//         width: detail.width,
//         height: detail.height,
//         tags: detail.tags,
//         color: detail.color,
//         fabric: detail.fabric,
//       };
//       setType('edit'); 
//       navigate("/dynamic-crop", { state: { id, updatedData, type: 'edit' } });
//     } catch (error) {
//       console.error("Error fetching/updating individual image:", error);
//     }
//   };

//   const handleDelClick = async (id) => {
//     try {
//       const response = await deleteIndividualImage(id);
//       console.log("Master image deleted successfully:", response);
//       setIndividualDetails((prevState) =>
//         prevState.filter((item) => item.id !== id)
//       );

//       // Optionally, you can update the state or perform any other actions after successful deletion
//     } catch (error) {
//       console.error("Error deleting master image:", error);
//       // Handle error if needed
//     }
//   };

//   const handleDeleteClick = async (id) => {
//     try {
//       const response = await deleteMasterImage(id);
//       console.log("Master image deleted successfully:", response);
//       setMasterImageDetails((prevState) =>
//         prevState.filter((item) => item.id !== id)
//       );
//     } catch (error) {
//       console.error("Error deleting master image:", error);
//     }
//   };
//   // Sample data for individual image details
//   const imageDetails = [
//     {
//       id: 1,
//       mainImageId: 1,
//       x: 440,
//       y: -0.13012313842773438,
//       width: 146,
//       height: 225,
//       tagName: "shirt",
//       color: "pink",
//       fabric: "cotton",
//     },
//   ];

//   // Sample data for master image details
//   /*    const masterImageDetails = [
//         {
//             id: 1,
//             imageNo: 1,
//             numOfCrops: 3
//         },
//         {
//             id: 2,
//             imageNo: 2,
//             numOfCrops: 5
//         }
//     ]; */

//   const filteredIndividualDetails = individualDetails.filter((detail) =>
//     Object.values(detail).some((value) =>
//       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const filteredMasterDetails = masterImageDetails.filter((detail) =>
//     detail.noOfCrops
//       .toString()
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   console.log("---------", individualDetails);
//   return (
//     <CCard>
//       <CCardHeader>
//         <div>
//           <h2 style={{ color: "#0096FF", paddingLeft: "500px" }}>
//             Dynamic Image Selection
//           </h2>
//         </div>

//         <div
//           style={{
//             paddingTop: "20px",
//             paddingLeft: "1100px",
//             paddingBottom: "20px",
//           }}
//         >
//           <button
//             style={{
//               width: "200px",
//               borderRadius: "2rem",
//               border: "#0096FF",
//               backgroundColor: "#0096FF",
//             }}
//             onClick={handleChange}
//           >
//             <AddIcon style={{ textSize: "50px", color: "#FFFFFF" }} />
//           </button>
//         </div>
//       </CCardHeader>
//       <CCardBody>
//         <div
//           style={{
//             paddingLeft: "10PX",
//             paddingTop: "20px",
//             display: "flex",
//             gap: "10px",
//             paddingBottom: "20px",
//           }}
//         >
//           <button
//             style={{
//               width: "300px",
//               borderRadius: "2rem",
//               border: "#0096FF",
//               backgroundColor: "#0096FF",
//               height: "40px",
//               color: "#FFFFFF",
//               fontWeight: "bold",
//               fontSize: "15px",
//             }}
//             onClick={handleMasterClick}
//           >
//             Master Image Details
//           </button>
//           <button
//             style={{
//               width: "300px",
//               borderRadius: "2rem",
//               border: "#0096FF",
//               backgroundColor: "#0096FF",
//               height: "40px",
//               color: "#FFFFFF",
//               fontWeight: "bold",
//               fontSize: "15px",
//             }}
//             onClick={handleIndividualClick}
//           >
//             Individual Image Details
//           </button>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <input
//               type="text"
//               placeholder="Search"
//               style={{
//                 borderRadius: "2rem",
//                 borderColor: "#0096FF",
//                 marginRight: "5px",
//               }}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <SearchOutlinedIcon style={{ color: "#0096FF" }} />
//           </div>
//         </div>

//         {showMasterTable && (
//           <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
//             <CTableHead style={{ paddingTop: "20px" }}>
//               <CTableRow
//                 style={{ backgroundColor: "#0096FF", fontWeight: "bold" }}
//               >
//                 <CTableDataCell>S.No</CTableDataCell>
//                 <CTableDataCell>Image No</CTableDataCell>
//                 <CTableDataCell>No of Crops</CTableDataCell>
//                 <CTableDataCell>Delete</CTableDataCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredMasterDetails.map((detail, index) => (
//                 <CTableRow
//                   key={index}
//                   style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}
//                 >
//                   <CTableDataCell
//                     style={{ paddingLeft: "25px", verticalAlign: "middle" }}
//                   >
//                     {index + 1}
//                   </CTableDataCell>
//                   {/* <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}><img src={detail.mainImage} alt={`Master Image ${detail.id}`}  style={{ width: "100px", height: "auto" }} /></CTableDataCell> */}
//                   <CTableDataCell
//                     style={{ paddingLeft: "25px", verticalAlign: "middle" }}
//                   >
//                     {detail.id}{" "}
//                   </CTableDataCell>
//                   <CTableDataCell
//                     style={{ paddingLeft: "25px", verticalAlign: "middle" }}
//                   >
//                     {detail.noOfCrops}
//                   </CTableDataCell>
//                   <CTableDataCell
//                     style={{ paddingLeft: "25px", verticalAlign: "middle" }}
//                   >
//                     <DeleteIcon onClick={() => handleDeleteClick(detail.id)} />
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         )}

//         {showIndividualTable && (
//           <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
//             <CTableHead style={{ paddingTop: "20px" }}>
//               <CTableRow style={{ backgroundColor: "#0096FF" }}>
//                 <CTableHeaderCell>S.No</CTableHeaderCell>
//                 <CTableHeaderCell>Main Image ID</CTableHeaderCell>
//                 <CTableHeaderCell>X</CTableHeaderCell>
//                 <CTableHeaderCell>Y</CTableHeaderCell>
//                 <CTableHeaderCell>Width</CTableHeaderCell>
//                 <CTableHeaderCell>Height</CTableHeaderCell>
//                 <CTableHeaderCell>TagName</CTableHeaderCell>
//                 <CTableHeaderCell>Color</CTableHeaderCell>
//                 <CTableHeaderCell>Fabric</CTableHeaderCell>
//                 <CTableHeaderCell>Edit</CTableHeaderCell>
//                 <CTableHeaderCell>Delete</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredIndividualDetails.map((detail, index) => (
//                 <CTableRow
//                   key={index}
//                   style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}
//                 >
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {index + 1}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.mainImageId}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.axisX}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.axisY}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.width}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.height}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.tags}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.color}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     {detail.fabric}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     <ModeEditOutlineIcon
//                       onClick={() => handleIndividualEditClick(detail.id)}
//                     />
//                   </CTableDataCell>
//                   <CTableDataCell style={{ paddingLeft: "25px" }}>
//                     <DeleteIcon onClick={() => handleDelClick(detail.id)} />
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         )}
//       </CCardBody>
//     </CCard>
//   );
// };

// export default Main;

/* import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from "@coreui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { getAllMasterImages } from './services/MainImageAPI/getAllMasterImages ';
import { individualgetall } from './services/cropDynamicAPI/individualgetall';
import { deleteMasterImage } from './services/MainImageAPI/deleteMasterImage';
import {deleteIndividualImage} from './services/cropDynamicAPI/deleteIndividualImage';
import { individualId } from './services/cropDynamicAPI/individualId';
import {createMasterImage} from './services/MainImageAPI/createMasterImage';
import {createIndividualImage} from './services/cropDynamicAPI/createIndividualImage';

const Main = () => {
  const navigate = useNavigate();
  const [showMasterTable, setShowMasterTable] = useState(true);
  const [showIndividualTable, setShowIndividualTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterImageDetails, setMasterImageDetails] = useState([]);
  const [individualDetails, setIndividualDetails] = useState([]);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const fetchMasterImages = async () => {
    try {
      const data = await getAllMasterImages();
      setMasterImageDetails(data);
    } catch (error) {
      console.error("Error fetching master images:", error);
    }
  };
  useEffect(() => {
    fetchMasterImages();
  }, []);

  useEffect(() => {
    const fetchIndividualImages = async () => {
      try {
        const data = await individualgetall();
        setIndividualDetails(data);
      } catch (error) {
        console.error("Error fetching individual images:", error);
      }
    };

    fetchIndividualImages();
  }, []);

  const handleAddIconClick = async () => {
    try {
      const response = await createMasterImage();
      console.log("Master image created successfully:", response);
      fetchMasterImages();
      navigate("/dynamic-crop");
    } catch (error) {
      console.error("Error creating master image:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await deleteMasterImage(id);
      console.log("Master image deleted successfully:", response);
      setMasterImageDetails((prevState) => prevState.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting master image:", error);
    }
  };

  const handleIndividualEditClick = async (id) => {
    try {
      const response = await individualId(id);
      console.log("Individual image fetched successfully:", response);
      setSelectedIndividual(response);
    } catch (error) {
      console.error("Error fetching individual image:", error);
    }
  };

  const handleDelClick = async (id) => {
    try {
      const response = await deleteIndividualImage(id);
      console.log("Master image deleted successfully:", response);
      setIndividualDetails((prevState) => prevState.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting master image:", error);
    }
  };

  const filteredIndividualDetails = individualDetails.filter((detail) =>
    Object.values(detail).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredMasterDetails = masterImageDetails.filter((detail) =>
    detail.noOfCrops.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CCard>
      <CCardHeader>
        <div>
          <h2 style={{ color: "#0096FF", paddingLeft: "500px" }}>Dynamic Image Selection</h2>
        </div>
        <div style={{ paddingTop: "20px", paddingLeft: "1100px", paddingBottom: "20px" }}>
          <button
            style={{
              width: "200px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
            }}
            onClick={handleAddIconClick}
          >
            <AddIcon style={{ textSize: "50px", color: "#FFFFFF" }} />
          </button>
        </div>
      </CCardHeader>
      <CCardBody>
        <div style={{ paddingLeft: "10PX", paddingTop: "20px", display: "flex", gap: "10px", paddingBottom: "20px" }}>
          <button
            style={{
              width: "300px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
              height: "40px",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "15px",
            }}
            onClick={() => setShowMasterTable(true)}
          >
            Master Image Details
          </button>
          <button
            style={{
              width: "300px",
              borderRadius: "2rem",
              border: "#0096FF",
              backgroundColor: "#0096FF",
              height: "40px",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "15px",
            }}
            onClick={() => setShowIndividualTable(true)}
          >
            Individual Image Details
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search"
              style={{ borderRadius: "2rem", borderColor: "#0096FF", marginRight: "5px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchOutlinedIcon style={{ color: "#0096FF" }} />
          </div>
        </div>
        {showMasterTable && (
          <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
            <CTableHead style={{ paddingTop: "20px" }}>
              <CTableRow style={{ backgroundColor: "#0096FF", fontWeight: "bold" }}>
                <CTableDataCell>S.No</CTableDataCell>
                <CTableDataCell>Image No</CTableDataCell>
                <CTableDataCell>No of Crops</CTableDataCell>
                <CTableDataCell>Delete</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredMasterDetails.map((detail, index) => (
                <CTableRow key={index} style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{index + 1}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.id} </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.noOfCrops}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>
                    <DeleteIcon onClick={() => handleDeleteClick(detail.id)} />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        {showIndividualTable && (
          <CTable style={{ borderCollapse: "collapse", width: "100%" }}>
            <CTableHead style={{ paddingTop: "20px" }}>
              <CTableRow style={{ backgroundColor: "#0096FF", fontWeight: "bold" }}>
                <CTableDataCell>S.No</CTableDataCell>
                <CTableDataCell>Image No</CTableDataCell>
                <CTableDataCell>X</CTableDataCell>
                <CTableDataCell>Y</CTableDataCell>
                <CTableDataCell>Width</CTableDataCell>
                <CTableDataCell>Height</CTableDataCell>
                <CTableDataCell>Edit</CTableDataCell>
                <CTableDataCell>Delete</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredIndividualDetails.map((detail, index) => (
                <CTableRow key={index} style={{ backgroundColor: index % 2 === 0 ? "#D3D3D3" : "" }}>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{index + 1}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.masterImage}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.x}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.y}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.width}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>{detail.height}</CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>
                    <ModeEditOutlineIcon onClick={() => handleIndividualEditClick(detail.id)} />
                  </CTableDataCell>
                  <CTableDataCell style={{ paddingLeft: "25px", verticalAlign: "middle" }}>
                    <DeleteIcon onClick={() => handleDelClick(detail.id)} />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default Main; */
