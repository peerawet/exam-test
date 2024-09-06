import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Graph = () => {
  const [ageData, setAgeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          "https://api-exam-test.onrender.com/transactions/"
        );
        const transactions = response.data.transactions;
        const ageCounts = {};

        // Calculate age for each transaction and count them
        transactions.forEach((transaction) => {
          const age = calculateAge(transaction.birth_date);
          if (age in ageCounts) {
            ageCounts[age]++;
          } else {
            ageCounts[age] = 1;
          }
        });

        // Prepare data for the chart
        const labels = Object.keys(ageCounts).sort((a, b) => a - b);
        const data = labels.map((label) => ageCounts[label]);

        setAgeData({
          labels,
          datasets: [
            {
              label: "Number of Members by Age",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    // Adjust age if the birth date has not occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Member Count by Age</h2>
      <Bar
        data={ageData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Number of Members by Age",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default Graph;
