import React, { useState } from "react";
import Button from "../components/Button";
import "../styles/modal.css";
import { ContactContext } from '../context/ContactContext';

const AddContactModal = ({ isOpen, onClose, onAddContact, customers = [] }) => {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    linkedCustomerId: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in required fields.");
      return;
    }
    onAddContact({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      customer: form.linkedCustomerId
    });
    setForm({ firstName: "", lastName: "", email: "", phone: "", linkedCustomerId: "" });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add Contact</h3>
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
            Linked Customer:
            <select name="linkedCustomerId" value={form.linkedCustomerId} onChange={handleChange}>
              <option value="">— None —</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName} ({c.company || "No Company"})
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <Button type="submit">Add Contact</Button>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
