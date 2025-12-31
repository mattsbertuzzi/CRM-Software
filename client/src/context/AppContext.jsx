import React, { createContext, useState, useEffect } from "react";
import { UserProvider } from "./userContext";
import { DealProvider } from "./DealContext";
import { ContactProvider } from "./ContactContext";
import { CustomerProvider } from "./CustomerContext";
import App from "../App";

// Create Context
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    return(
        <UserProvider>
            <DealProvider>
                <ContactProvider>
                    <CustomerProvider>
                        {children}
                    </CustomerProvider>
                </ContactProvider>
            </DealProvider>
        </UserProvider>
    )
};