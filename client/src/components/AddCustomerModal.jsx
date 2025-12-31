import React, { useState } from "react";
import Button from "../components/Button";
import "../styles/modal.css";

const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      alert("Please fill in required fields.");
      return;
    }
    onAddCustomer(form);
    setForm({ firstName: "", lastName: "", email: "", company: "" });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add Customer</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            First Name*:
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last Name:
            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </label>
          <label>
            Email*:
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Company:
            <input name="company" value={form.company} onChange={handleChange} />
          </label>
          <div className="modal-actions">
            <Button type="submit">Add Customer</Button>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
