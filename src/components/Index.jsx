import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/transactions/");
        setTransactions(response.data.transactions);
        setSortedTransactions(response.data.transactions);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction.first_name.toLowerCase().includes(search.toLowerCase()) ||
        transaction.last_name.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filteredTransactions].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedTransactions(sorted);
  }, [transactions, search, sortField, sortDirection]);

  const handleSort = (field) => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      birth_date: new Date(transaction.birth_date).toISOString().split("T")[0], // Ensure date format
    });
    setPreviewImage(transaction.profile_image || ""); // Set image preview
    setShowEditPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/transactions/delete/${id}`);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete transaction");
    }
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditingTransaction(null);
  };

  const handleUpdate = async () => {
    try {
      // Convert date input value to ISO string
      const updatedDate = new Date(editingTransaction.birth_date).toISOString();

      const response = await axios.put(
        `http://localhost:4000/transactions/edit/${editingTransaction.id}`,
        {
          ...editingTransaction,
          birth_date: updatedDate,
          profile_image: previewImage, // Ensure profile_image is included
        }
      );

      // Handle response
      if (response.status === 200) {
        setTransactions(
          transactions.map((transaction) =>
            transaction.id === editingTransaction.id
              ? {
                  ...editingTransaction,
                  birth_date: updatedDate,
                  profile_image: previewImage,
                }
              : transaction
          )
        );
        handleClosePopup();
      } else {
        setError("Failed to update transaction");
      }
    } catch (err) {
      setError(err.message || "Failed to update transaction");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditingTransaction({
          ...editingTransaction,
          profile_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Transactions List</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort("prefix")}>Prefix</th>
            <th onClick={() => handleSort("first_name")}>First Name</th>
            <th onClick={() => handleSort("last_name")}>Last Name</th>
            <th onClick={() => handleSort("birth_date")}>Birth Date</th>
            <th>Profile Image</th>
            <th onClick={() => handleSort("created_at")}>Created At</th>
            <th onClick={() => handleSort("updated_at")}>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.prefix}</td>
              <td>{transaction.first_name}</td>
              <td>{transaction.last_name}</td>
              <td>{new Date(transaction.birth_date).toLocaleDateString()}</td>
              <td>
                {transaction.profile_image ? (
                  <img
                    src={transaction.profile_image}
                    alt="Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              <td>{new Date(transaction.updated_at).toLocaleString()}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() => handleEdit(transaction)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(transaction.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Popup */}
      {showEditPopup && editingTransaction && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Transaction</h3>
            <form>
              <div className="form-group">
                <label>Prefix</label>
                <input
                  type="text"
                  value={editingTransaction.prefix}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      prefix: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={editingTransaction.first_name}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={editingTransaction.last_name}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  value={
                    new Date(editingTransaction.birth_date)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      birth_date: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
              <button type="button" onClick={handleUpdate}>
                Update
              </button>
              <button type="button" onClick={handleClosePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
