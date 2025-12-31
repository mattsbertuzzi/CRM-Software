import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import AddContactModal from "../components/AddContactModal";
import "../styles/tables.css";
import { ContactContext } from '../context/ContactContext';
import { CustomerContext } from '../context/CustomerContext';

const Contacts = () => {
  const navigate = useNavigate();
  // Retrieve contacts
  const ContactContextProvider = useContext(ContactContext);
  const { fetchAllContacts, createNewContact } = ContactContextProvider;
  const [contacts, setContacts] = useState([]);
  // Retrieve customers
  const CustomerContextProvider = useContext(CustomerContext);
  const customers = CustomerContextProvider.customers;

  useEffect(()=>{
    async function fetchData(){
      const data = await fetchAllContacts()
      setContacts(data)
    };
    fetchData()
  }, [ContactContextProvider.getContactNumber()]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Handler for adding a new contact
  const handleAddContact = async(newContact) => {
    await createNewContact(newContact);
    const newContacts = await fetchAllContacts();
    setContacts(...contacts, newContacts);
    alert(`Contact ${newContact.firstName} ${newContact.lastName} added!`);
    return null;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>Contacts</h2>
        <Button variant="primary" onClick={() => setAddModalOpen(true)}>
          + Add Contact
        </Button>
      </div>

      {/* Contact Table */}
      <div className="table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Customer</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="table-row"
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <td>{contact.firstName} {contact.lastName}</td>
                <td>{contact.email}</td>
                <td>
                  {contact.customer ? (
                    <span
                      className="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customers/${contact.customer._id}`);
                      }}
                    >
                      {contact.customer.name}
                    </span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <AddContactModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddContact={handleAddContact}
          customers={customers}
        />
      )}
    </div>
  );
};

export default Contacts;
