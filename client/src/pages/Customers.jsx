import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import AddCustomerModal from "../components/AddCustomerModal";
import "../styles/tables.css";
import { CustomerContext } from "../context/CustomerContext";

const Customers = () => {
  const navigate = useNavigate();

  // Context
  const CustomerContextProvider = useContext(CustomerContext);
  const { fetchAllCustomers, createNewCustomer } = CustomerContextProvider;

  // State
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  /**
   * Fetch customers on mount + when customers change
   */
  useEffect(() => {
    async function fetchData() {
      const data = await fetchAllCustomers();
      setCustomers(data);
    }
    fetchData();
  }, [CustomerContextProvider.getCustomerNumber?.()]);

  /**
   * Add new customer
   */
  const handleAddCustomer = async (newCustomer) => {
    await createNewCustomer(newCustomer);
    const updatedCustomers = await fetchAllCustomers();
    setCustomers(updatedCustomers);
    alert(`Customer ${newCustomer.firstName} ${newCustomer.lastName} added!`);
    return null;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>Customers</h2>
        <Button variant="primary" onClick={() => setAddModalOpen(true)}>
          + Add Customer
        </Button>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Primary Contact</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="table-row"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
                <td>
                  {customer.contact ? (
                    <span
                      className="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/contacts/${customer.contact.id}`);
                      }}
                    >
                      {customer.contact.firstName} {customer.contact.lastName}
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

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddCustomer={handleAddCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
