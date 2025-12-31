import React, { useState, useEffect, useContext } from "react";
import Button from "../components/Button";
import "../styles/modal.css";
import { UserContext } from "../context/userContext";

const AddDealModal = ({ isOpen, onClose, onAddDeal, onCustomerReq = [] }) => {
  const { users, fetchAllUsers } = useContext(UserContext);

  const [form, setForm] = useState({
    title: "",
    value: "",
    stage: "lead",
    linkedCustomerId: "",
    owner: ""
  });

  const [allUsers, setAllUsers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

  // Load users and customers on mount
  useEffect(() => {
    async function loadUsers() {
      const fetchedUsers = await fetchAllUsers();
      const fetchedCustomers = await onCustomerReq();
      setAllUsers(fetchedUsers || []);
      setAllCustomers(fetchedCustomers || []);
    }
    loadUsers();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.value || !form.linkedCustomerId) {
      alert("Please fill in all required fields (Title, Value, Customer).");
      return;
    }

    // Prepare payload with correct _id references
    const newDeal = {
      title: form.title,
      value: Number(form.value),
      stage: form.stage,
      customer: form.linkedCustomerId,
      owner: form.owner || null
    };

    onAddDeal(newDeal);

    // Reset form
    setForm({
      title: "",
      value: "",
      stage: "lead",
      linkedCustomerId: "",
      owner: ""
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add Deal</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Deal Title*:
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Value*:
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stage:
            <select name="stage" value={form.stage} onChange={handleChange}>
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </label>

          <label>
            Linked Customer*:
            <select
              name="linkedCustomerId"
              value={form.linkedCustomerId}
              onChange={handleChange}
              required
            >
              <option value="">— Select Customer —</option>
              {allCustomers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName} ({c.company || "No Company"})
                </option>
              ))}
            </select>
          </label>

          <label>
            Assigned To:
            <select
              name="owner"
              value={form.owner}
              onChange={handleChange}
            >
              <option value="">— None —</option>
              {allUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <Button type="submit">Add Deal</Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDealModal;
