import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

export const ChartComponents = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const [err, setError] = useState(null);
  const candleStickSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [tickerData, setData] = useState<any[]>([]); // Store the `data` array from the response
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null); // Track last update time
  let socket: WebSocket;
  const fetchBTCData = async () => {
    try {
      const res = await fetch("http://localhost:8080/btc");
      if (!res.ok) {
        throw new Error("Network response was not ok.");
      }
      const response = await res.json();
      setData(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fetch Data
  useEffect(() => {
    fetchBTCData();
  }, []);

  // Fetch Live Data

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current!);
    // Add Chart Configurations
    chart.current.applyOptions({
      width: 500,
      height: 400,
      layout: {
        background: { color: "#FFFFFF" },
        textColor: "rgba(0, 0, 0, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#f0f0f0",
        },
        horzLines: {
          color: "#f0f0f0",
        },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
      rightPriceScale: {
        borderColor: "#485c7b",
        autoScale: true,
        mode: 0,
      },
      timeScale: {
        borderColor: "#485c7b",
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    candleStickSeries.current = chart.current.addCandlestickSeries();

    return () => {
      chart.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (candleStickSeries.current) {
      candleStickSeries.current.setData(tickerData);
    }
  }, [tickerData]);

  useEffect(() => {
    socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);

      if (parsedData.confirm == true) {
        candleStickSeries.current?.update(JSON.parse(event.data));
      }
    };

    // Handle WebSocket connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div
      id="chartContainerRef"
      ref={chartContainerRef}
      className="chart-container"
      style={{
        marginLeft: "12px",
      }}
    />
  );
};
