import React, { useState, useEffect } from 'react';

const EditIndividualImage = ({ data, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    setEditedData(data); // Initialize editedData with the received data
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <div>
      <h3>Edit Individual Image</h3>
      <form>
        <label>Main Image ID:</label>
        <input
          type="text"
          name="mainImageId"
          value={editedData.mainImageId}
          onChange={handleChange}
        />
        <label>Main Image:</label>
        <img
        name="mainImage"
        value={editedData.mainImage}
        onChange={handleChange}/>
        <label>Cropped Image:</label>
          <img
        name="croppedImage"
        value={editedData.croppedImage}
        onChange={handleChange}/>
        <label>X Axis:</label>
          <input
          type="text"
          name="axisX"
          value={editedData.axisX}
          onChange={handleChange}
        />
        <label>Y Axis:</label>
          <input
          type="text"
          name="axisY"
          value={editedData.axisY}
          onChange={handleChange}
        />
        <label>Width:</label>
          <input
          type="text"
          name="width"
          value={editedData.width}
          onChange={handleChange}
        />
        <label>Height:</label>
          <input
          type="text"
          name="height"
          value={editedData.height}
          onChange={handleChange}
        />
        <label>Tags:</label>
          <input
          type="text"
          name="tags"
          value={editedData.tags}
          onChange={handleChange}
        />
        <label>Color:</label>
          <input
          type="text"
          name="color"
          value={editedData.color}
          onChange={handleChange}
        />
        <label>Fabric:</label>
          <input
          type="text"
          name="fabric"
          value={editedData.fabric}
          onChange={handleChange}
        />
        {/* Add other input fields for editing */}
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditIndividualImage;
