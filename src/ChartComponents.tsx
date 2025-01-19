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
  const [liveData, setLiveData] = useState<any[]>([]); // Store the live data after the kline data

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

  const liveFetchingBTC = async () => {
    try {
      const res = await fetch("http://localhost:3000");
      if (!res.ok) {
        throw new Error("Network Response was not ok");
      }
      const response = await res.json();
      setLiveData(response);
    } catch (err: any) {
      setError(err.message);
    }
  };
  // Fetch Data
  useEffect(() => {
    fetchBTCData();
  }, []);

  useEffect(() => {}, []);

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

  useEffect(() => {}, []);

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
