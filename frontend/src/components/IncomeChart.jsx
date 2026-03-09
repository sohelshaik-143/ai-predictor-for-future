import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function IncomeChart({ data = [], prediction = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart safely
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Gradient for Actual Income
    const gradientActual = ctx.createLinearGradient(0, 0, 0, 400);
    gradientActual.addColorStop(0, "rgba(59,130,246,0.4)");
    gradientActual.addColorStop(1, "rgba(59,130,246,0)");

    // Gradient for Prediction
    const gradientPrediction = ctx.createLinearGradient(0, 0, 0, 400);
    gradientPrediction.addColorStop(0, "rgba(16,185,129,0.4)");
    gradientPrediction.addColorStop(1, "rgba(16,185,129,0)");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Actual Income",
            data,
            borderColor: "#3b82f6",
            backgroundColor: gradientActual,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#3b82f6"
          },
          {
            label: "AI Prediction",
            data: prediction,
            borderColor: "#10b981",
            backgroundColor: gradientPrediction,
            tension: 0.4,
            fill: true,
            borderDash: [6, 6],
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#10b981"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: "easeInOutQuart"
        },
        plugins: {
          legend: {
            labels: {
              color: "#1f2937",
              font: { size: 14, weight: "600" }
            }
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#111827",
            titleColor: "#facc15",
            bodyColor: "#f9fafb"
          }
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#374151", font: { weight: "500" } }
          },
          y: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { color: "#374151", font: { weight: "500" } }
          }
        }
      }
    });

    // Cleanup chart on unmount to prevent errors
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, prediction]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}