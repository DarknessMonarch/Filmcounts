import { useEffect, useState, useCallback } from "react";
import styles from "@/app/styles/statistics.module.css";
import LoadingLogo from "@/app/components/LoadingLogo";
import Dropdown from "@/app/components/StatsDropdown";
import NoDataImg from "@/public/assets/noData.png";
import Nothing from "@/app/components/Nothing";

import { SlCalender as CalenderIcon } from "react-icons/sl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineGraphComponent({
  fetchDataFunction,
  title = "Projects",
  lineColor = "#26cf96",
  periodOptions = ["Monthly", "Weekly", "Daily"],
}) {
  const [graphData, setGraphData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0]);

  const formattedOptions = periodOptions.map((period, index) => ({
    name: period,
    code: index.toString(),
  }));

  const fetchData = useCallback(async () => {
    if (fetchDataFunction) {
      try {
        const response = await fetchDataFunction(selectedPeriod);
        if (response && response.success) {
          setGraphData(response.data);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    } else {
      setGraphData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"],
        values: [22000, 35000, 25000, 40000, 55000, 45000, 40000],
      });
    }
  }, [fetchDataFunction, selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedPeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
          color: "#26cf96",
          backgroundColor: "#26cf96",
        },
      },
      tooltip: {
        backgroundColor: "#2d3748",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#26cf96",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(160, 168, 180, 0.1)",
        },
        ticks: {
          color: "#a0a8b4",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#a0a8b4",
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: "#ffffff",
        borderColor: lineColor,
        borderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const renderData = () => {
    if (!graphData) {
      return (
        <div className={styles.graphComponentContainer}>
          <LoadingLogo />
        </div>
      );
    }

    const data = {
      labels: graphData.labels,
      datasets: [
        {
          label: title,
          data: graphData.values,
          borderColor: lineColor,
          backgroundColor: "rgba(160, 217, 113, 0.05)",
          fill: true,
        },
      ],
    };

    return <Line options={options} data={data} />;
  };

  const handlePeriodChange = (option) => {
    setSelectedPeriod(option.name);
  };

  return (
    <div className={styles.graphComponentContainer}>
      <div className={styles.graphHeader}>
        <Dropdown
          options={formattedOptions}
          Icon={
            <CalenderIcon aria-label="Calendar" className={styles.authIcon} />
          }
          dropPlaceHolder={selectedPeriod || "Choose Period"}
          onSelect={handlePeriodChange}
        />
      </div>
      <div className={styles.graphContent}>
        {graphData?.labels?.length > 0 ? (
          renderData()
        ) : (
          <Nothing
            NothingImage={NoDataImg}
            Text="No Data Available"
            Alt="No Data Available"
          />
        )}
      </div>
    </div>
  );
}
