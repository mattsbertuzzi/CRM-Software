import React, { createContext, useState, useEffect } from "react";

// Create Context
export const DealContext = createContext();

// Provider Component
export const DealProvider = ({ children }) => {
    const [deal, setDeal] = useState(null);
    const [deals, setDeals] = useState([]);

    const getDealNumber = () => {
        return deals.length;
    };

    const getDealValue = () => {
        if(deals && deals.length !== 0){
            return deals.reduce((total, deal) => total + (deal.value || 0), 0);
        };
        return 0;
    };

    const getDeals = async()=>{
        const data = await fetchAllDeals();
        return data;
    };

    const fetchAllDeals = async () => {
        const url = 'http://localhost:3000/api/deals/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error fetching deals: No token found, user not authenticated");
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
            console.log("Fetched deals:", data);
            setDeals(data);
            return data;
        } catch (error) {
            console.error("Error fetching deals:", error);
        }
    };

    const fetchOneDeal = async (id) => {
        const url = `http://localhost:3000/api/deals/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error fetching deal: No token found, user not authenticated");
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
            console.log("Fetched deal:", data);
            setDeal(data);
            return data;
        } catch (error) {
            console.error("Error fetching deal:", error);
        }
    };

    const createNewDeal = async (dealData) => {
        const url = 'http://localhost:3000/api/deals/';
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error creating new deal: No token found, user not authenticated");
            return;
        };
        // Validate payload for contact creation
        const { title, value, customer, owner } = dealData;
        if (!title || !value || !customer || !owner) {
            console.error("Error creating new deal: Required fields are missing");
            return;
        };
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(dealData),
            };
            const response = await fetch(url, options);
            const data = await response.json();
            console.log("New deal created:", data);
            fetchAllDeals();
            setDeals(data);
        } catch (error) {
            console.error("Error creating new deal:", error);
        };
    };

    const updateDeal = async (id, updatedData) => {
        const url = `http://localhost:3000/api/deals/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error updating deal: No token found, user not authenticated");
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
            console.log(`Deal ${id} updated:`, data);
            setDeal(data);
            return data;
        } catch (error) {
            console.error(`Error updating deal ${id}:`, error);
        }
    };

    const deleteDeal = async (id) => {
        const url = `http://localhost:3000/api/deals/${id}`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error deleting deal: No token found, user not authenticated");
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
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(`Deal ${id} successfully deleted.`);
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
        }
    };

    const changeDealStage = async (id, newStage) => {
        const url = `http://localhost:3000/api/deals/${id}/change-stage`;
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Error changing deal stage: No token found, user not authenticated");
            return;
        };
        // Validate new stage
        if (!newStage) {
            console.error("Error changing deal stage: New stage is required");
            return;
        };
        const options = {
            'method': 'PATCH',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`,
            },
            'body': JSON.stringify({ stage: newStage }),
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(`Deal ${id} stage changed to ${newStage}:`, data);
            setDeal(data);
        } catch (error) {
            console.error(`Error changing stage for deal ${id}:`, error);
        };
    }

    // Reload contacts on component mount
    useEffect(() => {
        async function loadData(){
            await fetchAllDeals();
            getDealNumber();
            getDealValue();
        };
        loadData();
    }, []);

    return (
        <DealContext.Provider value={{
            deal,
            deals,
            getDealNumber,
            getDealValue,
            getDeals,
            fetchAllDeals,
            fetchOneDeal,
            createNewDeal,
            updateDeal,
            deleteDeal,
            changeDealStage
        }}>
            {children}
        </DealContext.Provider>
    )
}