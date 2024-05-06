
export const deleteIndividualImage = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/individual/delete/${id}`, {
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