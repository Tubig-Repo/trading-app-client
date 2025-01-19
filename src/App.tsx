import { useEffect } from "react";
import axios from "axios";
import { ChartComponents } from "./ChartComponents";
function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <>
      <ChartComponents />
      <p>Light Weight Charts</p>
    </>
  );
}

export default App;
