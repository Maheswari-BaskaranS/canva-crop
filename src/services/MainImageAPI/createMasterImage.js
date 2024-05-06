export const createMasterImage = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/master/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Add any payload data if needed
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating master image:", error);
    throw error;
  }
};