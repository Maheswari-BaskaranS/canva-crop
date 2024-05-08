import {API_URL} from "../../utils/constant"
export const individualgetbyId = async (id) => {
  try { 
    const response = await fetch(`http://localhost:8000/api/v1/individual/getById/${id}`);
    //const response = await fetch(`${API_URL+'api/v1/master/getAll'}`);
    const contentType = response.headers.get("content-type");
     if (!response.ok) {
      throw new Error("Network response was not ok");
    } else if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Unexpected response format:", text);
      throw new Error("Unexpected response format");
    }
    const data = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.error("Error fetching master images:", error);
    throw error;
  }
};
