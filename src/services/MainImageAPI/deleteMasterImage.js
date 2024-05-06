// export const deleteMasterImage = async (id) => {
//   try {
//     const response = await fetch(`http://localhost:8000/api/v1/master/delete/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json'
//         // Add any additional headers if needed
//       },
//       // You can include a request body if required
//       // body: JSON.stringify({ id: id })
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data; // You can return any response data if needed
//   } catch (error) {
//     console.error("Error deleting master image:", error);
//     throw error; // Re-throw the error for handling in the component
//   }
// };


// Implement a delete function
export const deleteMasterImage = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/master/delete/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error("Failed to delete master image");
    }
    // Return success message or handle as needed
    return "Master image deleted successfully";
  } catch (error) {
    console.error("Error deleting master image:", error);
    throw error;
  }
};