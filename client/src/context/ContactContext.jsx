import React, { createContext, useState, useEffect } from "react";

// Create Context
export const ContactContext = createContext();

// Provider Component
export const ContactProvider = ({ children }) => {
    const [contact, setContact] = useState(null);
    const [contacts, setContacts] = useState([]);

    const getContactNumber = () => {
        return contacts.length;
    };

    const getContacts = async()=>{
        const data = await fetchAllContacts();
        return data;
    }

    const fetchAllContacts = async () => {
        const url = 'http://localhost:3000/api/contacts/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error fetching contacts: No token found, user not authenticated");
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
            const response = await fetch(url, options);
            const data = await response.json();
            console.log("Fetched contacts:", data);
            setContacts(data);
            return data;
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const fetchOneContact = async (id) => {
        const url = `http://localhost:3000/api/contacts/${id}`;
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
            const response = await fetch(url, options);
            const data = await response.json();
            console.log("Fetched contact:", data);
            setContact(data);
            return data;
        } catch (error) {
            console.error("Error fetching contact:", error);
        }
    };

    const createNewContact = async (contactData) => {
        const url = 'http://localhost:3000/api/contacts/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error creating new contact: No token found, user not authenticated");
            return;
        };
        // Validate payload for contact creation
        const { firstName, lastName, email } = contactData;
        if (!firstName || !lastName || !email) {
            console.error("Error creating new contact: Required fields are missing");
            return;
        };
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(contactData),
            };
            const response = await fetch(url, options);
            const data = await response.json();
            console.log("New contact created:", data);
            await fetchAllContacts();
        } catch (error) {
            console.error("Error creating new contact:", error);
        };
    };

    const updateContact = async (id, updatedData) => {
        const url = `http://localhost:3000/api/contacts/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error updating contact: No token found, user not authenticated");
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
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(`Contact ${id} updated:`, data);
            setContact(data);
        } catch (error) {
            console.error(`Error updating contact ${id}:`, error);
        }
    };

    const deleteContact = async (id) => {
        const url = `http://localhost:3000/api/contacts/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error deleting contact: No token found, user not authenticated");
            return;
        };
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                }
            };
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(`Contact ${id} successfully deleted.`);
        } catch (error) {
            console.error(`Error deleting contact ${id}:`, error);
        }
    };

    const convertContactToCustomer = async (id, contactList, extraInfo) => {
        const url = `http://localhost:3000/api/contacts/${id}/create-customer`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error converting contact to customer: No token found, user not authenticated");
            return;
        };
        // Build payload
        const contactData = contactList.find(contact => contact._id === id);
        if (!contactData) {
            console.error(`Error converting contact to customer: Contact with ID ${id} not found`);
            return;
        };
        const payload = {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            company: extraInfo.company || '',
            contact: contactData._id,
            email: contactData.email,
            phone: contactData.phone || '',
            address: extraInfo.address || ''
        };
        if (!payload.firstName || !payload.lastName || !payload.email) {
            console.error("Error converting contact to customer: Required fields are missing");
            return;
        };
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(payload),
            };
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(`New customer created from contact ${id}:`, data);
        } catch (error) {
            console.error("Error creating new contact:", error);
        }
    };

    // Reload contacts on component mount
    useEffect(() => {
        async function loadData(){
            await fetchAllContacts();
            getContactNumber();
        };
        loadData();
    }, []);

    return (
        <ContactContext.Provider value={{
            contact,
            contacts,
            getContacts,
            getContactNumber,
            fetchAllContacts,
            fetchOneContact,
            createNewContact,
            updateContact,
            deleteContact,
            convertContactToCustomer
        }}>
            {children}
        </ContactContext.Provider>
    )
}