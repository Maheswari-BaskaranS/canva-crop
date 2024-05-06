export const getAllMasterImages = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/master/getAll");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data.map(item => ({
      id: item.id,
      mainImage: item.mainImage,
      noOfCrops: item.noOfCrops
    }));
  } catch (error) {
    console.error("Error fetching master images:", error);
    throw error;
  }
};

