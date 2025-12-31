import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmailModal from "../components/EmailModal";
import "../styles/summary.css";
import { CustomerContext } from "../context/CustomerContext";
import { ContactContext } from "../context/ContactContext";
import { DealContext } from "../context/DealContext";

const CustomerSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOneCustomer, updateCustomer } = useContext(CustomerContext);
  const { getContacts } = useContext(ContactContext);
  const { getDeals } = useContext(DealContext);

  const [isEmailOpen, setEmailOpen] = useState(false);

  // Customer info
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    address: "",
    customerValue: 0
  });

  const [allContacts, setAllContacts] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [selectedDealIds, setSelectedDealIds] = useState([]);

  // Multi-select dropdown state
  const [isDealDropdownOpen, setDealDropdownOpen] = useState(false);
  const dealDropdownRef = useRef();

  useEffect(() => {
    async function loadData() {
      const customerData = await fetchOneCustomer(id);
      const contacts = await getContacts();
      const deals = await getDeals();

      setAllContacts(contacts);
      setAllDeals(deals);

      setCustomer({
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        company: customerData.company || "",
        position: customerData.position || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
        address: customerData.address || "",
        customerValue: customerData.customerValue || 0
      });

      setSelectedContactId(customerData.contact || "");
      setSelectedDealIds(customerData.deals || []);
    }
    loadData();
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dealDropdownRef.current && !dealDropdownRef.current.contains(event.target)) {
        setDealDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleDealToggle = (dealId) => {
    setSelectedDealIds((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleSave = async () => {
    await updateCustomer(id, {
      ...customer,
      contact: selectedContactId || null,
      deals: selectedDealIds
    });
    alert("Customer info saved!");
  };

  return (
    <div className="summary-container">
      {/* Header */}
      <div className="summary-header">
        <h2>{customer.firstName} {customer.lastName}</h2>
        <div className="summary-actions">
          <Button variant="primary" onClick={() => setEmailOpen(true)}>+ Email</Button>
          <Button variant="secondary" onClick={handleSave}>Save</Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="summary-section">
        <h3>Information</h3>
        {["firstName","lastName","company","position","email","phone","address","customerValue"].map(field => (
          <div className="summary-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "email" ? "email" : field === "customerValue" ? "number" : "text"}
              name={field}
              value={customer[field]}
              onChange={handleFieldChange}
            />
          </div>
        ))}

        {/* Contact Dropdown */}
        <div className="summary-field">
          <label>Primary Contact</label>
          <select
            value={selectedContactId}
            onChange={(e) => setSelectedContactId(e.target.value)}
          >
            <option value="">— None —</option>
            {allContacts.map((c) => (
              <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
            ))}
          </select>
        </div>

        {selectedContactId && (
          <span className="link" onClick={() => navigate(`/contacts/${selectedContactId}`)}>View Contact</span>
        )}
      </div>

      {/* Deals Multi-select */}
      <div className="summary-section" ref={dealDropdownRef}>
        <h3>Linked Deals</h3>
        <div className="multi-select-container" onClick={() => setDealDropdownOpen(!isDealDropdownOpen)}>
          {selectedDealIds.length
            ? allDeals.filter(d => selectedDealIds.includes(d._id)).map(d => d.title).join(", ")
            : "Select deals..."}
        </div>
        {isDealDropdownOpen && (
          <div className="multi-select-dropdown">
            {allDeals.map((deal) => (
              <label key={deal._id} className="multi-select-option">
                <input
                  type="checkbox"
                  checked={selectedDealIds.includes(deal._id)}
                  onChange={() => handleDealToggle(deal._id)}
                />
                {deal.title} — ${deal.value}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {isEmailOpen && (
        <EmailModal recipientEmail={customer.email} onClose={() => setEmailOpen(false)} />
      )}
    </div>
  );
};

export default CustomerSummary;
