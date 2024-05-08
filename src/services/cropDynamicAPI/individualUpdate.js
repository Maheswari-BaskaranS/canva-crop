export const individualUpdate = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/individual/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    console.log("ADSASFAFA",response)

    if (!response.ok) {
      throw new Error("Failed to edit individual image");
    }

    // Return success message or handle as needed
    return "Individual image edited successfully";
  } catch (error) {
    console.error("Error editing individual image:", error);
    throw error;
  }
};
