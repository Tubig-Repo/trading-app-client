import { useState, useEffect } from "react";

export const Home = () => {
  const [tradeData, setTradeData] = useState();
  const [err, setError] = useState();
  ("");
  const fetchTradeHistory = async () => {
    try {
      const res = await fetch("http://localhost:8080/history");
      if (!res.ok) {
        throw new Error("Network Response to Trade History was not ok");
      }
      const response = await res.json();
      setTradeData(response.data.list);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchTradeHistory();
  }, []);

  useEffect(() => {
    console.log(tradeData);
  }, [tradeData]);
  return (
    <div>
      {err && <p style={{ color: "red" }}>Error: {err}</p>}
      <h1>Home</h1>
    </div>
  );
};
