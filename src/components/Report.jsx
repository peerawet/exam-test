import React, { useState, useEffect } from "react";
import axios from "axios";

const Report = () => {
  const [ageData, setAgeData] = useState([]);
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

        // Convert ageCounts object to an array of objects for table display
        const ageDataArray = Object.keys(ageCounts).map((age) => ({
          age,
          count: ageCounts[age],
        }));

        setAgeData(ageDataArray);
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Age</th>
            <th>Number of Members</th>
          </tr>
        </thead>
        <tbody>
          {ageData.map((data, index) => (
            <tr key={index}>
              <td>{data.age}</td>
              <td>{data.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
