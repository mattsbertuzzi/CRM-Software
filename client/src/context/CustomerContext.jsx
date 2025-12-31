import React, { createContext, useState, useEffect } from "react";

// Create Context
export const CustomerContext = createContext();

// Provider Component
export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);

    const getCustomerNumber = () => {
        return customers.length;
    };

    const getCustomers = async() =>{
        const data = await fetchAllCustomers();
        return data;
    };

    const fetchAllCustomers = async () => {
        const url = 'http://localhost:3000/api/customers/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error fetching customers: No token found, user not authenticated");
            return;
        };
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
            };
            const response = await fetch(url,options);
            const data = await response.json();
            console.log("Fetched customers:", data);
            setCustomers(data);
            return data;
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchOneCustomer = async (id) => {
        const url = `http://localhost:3000/api/customers/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error fetching contact: No token found, user not authenticated");
            return;
        };
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
            };
            const response = await fetch(url,options);
            const data = await response.json();
            console.log("Fetched customer:", data);
            setCustomer(data);
            return data;
        } catch (error) {
            console.error("Error fetching customer:", error);
        }
    };

    const createNewCustomer = async (customerData) => {
        const url = 'http://localhost:3000/api/customers/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error creating new contact: No token found, user not authenticated");
            return;
        };
        // Validate payload for contact creation
        const { firstName, lastName, email } = customerData;
        if (!firstName || !lastName || !email) {
            console.error("Error creating new customer: Required fields are missing");
            return;
        };
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(customerData),
            };
            const response = await fetch(url,options);
            const data = await response.json();
            console.log("New customer created:", data);
            fetchAllCustomers();
        } catch (error) {
            console.error("Error creating new customer:", error);
        };
    };

    const updateCustomer = async (id, updatedData) => {
        const url = `http://localhost:3000/api/customers/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error updating customer: No token found, user not authenticated");
            return;
        };
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(updatedData),
            };
            const response = await fetch(url,options);
            const data = await response.json();
            console.log(`Customer ${id} updated:`, data);
            setCustomer(data);
            return data;
        } catch (error) {
            console.error(`Error updating customer ${id}:`, error);
        }
    };

    const deleteCustomer = async (id) => {
        const url = `http://localhost:3000/api/customers/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error deleting customer: No token found, user not authenticated");
            return;
        };
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`,
            }
        };
        try {
            const response = await fetch(url,options);
            const data = await response.json();
            console.log(`Customer ${id} successfully deleted.`);
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
        }
    };

    const createCustomerDeal = async (id, dealData) => {
        const url = `http://localhost:3000/api/customers/${id}/create-deal`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error creating deal from customer: No token found, user not authenticated");
            return;
        };
        // Validate deal payload
        const { title, value, stage } = dealData;
        if (!title || !value || !stage) {
            console.error("Error creating deal: Required fields are missing");
            return;
        };
        const dealPayload = {
            title: title,
            value: value,
            stage: stage,
            customer: id,
            expectedCloseDate: dealData.expectedCloseDate || null,
            assignedTo: dealData.assignedTo || null
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`,
            },
            body: JSON.stringify(dealPayload),
        };
        try {
            const response = await fetch(url,options);
            const data = await response.json();
            console.log(`Deal created from customer ${id}:`, data);
        } catch (error) {
            console.error(`Error creating deal from customer ${id}:`, error);
        };
    };

    // Reload contacts on component mount
    useEffect(() => {
        async function loadData(){
            await fetchAllCustomers();
            getCustomerNumber();
        };
        loadData();
    }, []);

    return (
        <CustomerContext.Provider value={{
            customer,
            customers,
            getCustomers,
            getCustomerNumber,
            fetchAllCustomers,
            fetchOneCustomer,
            createNewCustomer,
            updateCustomer,
            deleteCustomer,
            createCustomerDeal
        }}>
            {children}
        </CustomerContext.Provider>
    )
}