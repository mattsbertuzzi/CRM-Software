import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmailModal from "../components/EmailModal";
import "../styles/summary.css";
import { ContactContext } from "../context/ContactContext";
import { CustomerContext } from "../context/CustomerContext";

const ContactSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchOneContact, updateContact } = useContext(ContactContext);
  const { getCustomers } = useContext(CustomerContext);

  const [isEmailOpen, setEmailOpen] = useState(false);

  const [contact, setContact] = useState({
    id,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedCustomer: null
  });

  /**
   * Prefill form once contact + customers are available
   */
  useEffect(() => {
    async function loadData() {
      const contactData = await fetchOneContact(id);
      const customers = await getCustomers();
      const customerRef = await customers.find(
        (c) => c._id === contactData.customer
      );
      setContact({
        id: id,
        firstName: contactData.firstName || "",
        lastName: contactData.lastName || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
        linkedCustomer: customerRef || null
      });
    };
    loadData();
  }, [id]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    await updateContact(id, {
      id: parseInt(contact.id),
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      customer: contact.linkedCustomer?._id || null
    });

    alert("Contact info saved!");
  };

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>
          {contact.firstName} {contact.lastName}
        </h2>

        <div className="summary-actions">
          <Button variant="primary" onClick={() => setEmailOpen(true)}>
            + Email
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="summary-section">
        <h3>Information</h3>

        <div className="summary-field">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={contact.firstName}
            onChange={handleFieldChange}
          />
        </div>

        <div className="summary-field">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={contact.lastName}
            onChange={handleFieldChange}
          />
        </div>

        <div className="summary-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleFieldChange}
          />
        </div>

        <div className="summary-field">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleFieldChange}
          />
        </div>

        <div className="summary-field">
          <label>Customer</label>
          {contact.linkedCustomer ? (
            <span
              className="link"
              onClick={() =>
                navigate(`/customers/${contact.linkedCustomer.id}`)
              }
            >
              {contact.linkedCustomer.firstName}
            </span>
          ) : (
            <span className="muted">—</span>
          )}
        </div>
      </div>

      {isEmailOpen && (
        <EmailModal
          recipientEmail={contact.email}
          onClose={() => setEmailOpen(false)}
        />
      )}
    </div>
  );
};

export default ContactSummary;
