import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    prefix: "นาย",
    firstName: "",
    lastName: "",
    birthDate: "",
    profileImage: "", // Store as Base64 string
    age: "", // Add age to the form data
  });

  useEffect(() => {
    // Calculate age whenever birthDate changes
    const calculateAge = (birthDate) => {
      if (!birthDate) return "";
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }
      return age;
    };

    setFormData((prevState) => ({
      ...prevState,
      age: calculateAge(prevState.birthDate),
    }));
  }, [formData.birthDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert image to Base64 string and update state
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the server
      console.log("Sending data", formData);
      const response = await axios.post(
        "https://api-exam-test.onrender.com/transactions/create",
        formData
      );
      console.log("Response:", response.data);
      alert("Data successfully submitted!");
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div className="transaction-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>คำนำหน้าชื่อ</label>
          <select
            name="prefix"
            value={formData.prefix}
            onChange={handleInputChange}
          >
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>
        </div>

        <div className="form-group">
          <label>ชื่อ</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>นามสกุล</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>วันเดือนปีเกิด</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>อายุ</label>
          <input type="text" name="age" value={formData.age} readOnly />
        </div>

        <div className="form-group">
          <label>รูปภาพโปรไฟล์</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <button type="submit">บันทึก</button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
