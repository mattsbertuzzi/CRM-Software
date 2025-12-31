# Full-Stack CRM Automation App

## Project Overview

This is a full-stack CRM automation platform designed for small and medium businesses to manage users, contacts, customers, and deals in a centralized and efficient way. The application goes beyond standard CRM functionality by integrating **automation features**: sending emails, scheduling calendar events, and managing workflows programmatically.  

The frontend is built in **React** with **DnD-kit** for interactive drag-and-drop pipelines and **Chart.js** for visual insights. The backend leverages **Node.js** and **Express**, with **MongoDB** for persistent storage, providing secure authentication, role-based access, and automation services through **Nodemailer** and **Google Calendar API**.

This platform is ideal for businesses seeking to reduce manual work, streamline sales and customer management, and integrate automated workflows into their daily operations.

## Problem Statement

Many small and medium businesses struggle with fragmented customer data, scattered communications, and inefficient manual processes. Sales and support teams often spend significant time on repetitive tasks, such as emailing clients or scheduling follow-ups.  

Without automation, businesses risk losing leads, mismanaging deals, and making uninformed decisions. This CRM solves these issues by centralizing information and automating routine workflows.

## Objectives

- Provide a **centralized platform** to manage users, contacts, customers, and deals.  
- Implement **secure authentication** and **role-based access**.  
- Automate **email sending** and **calendar scheduling** for contacts and deals.  
- Enable **interactive pipelines** with drag-and-drop deal management.  
- Deliver **visual insights** into deals, pipeline stages, and performance.  
- Demonstrate expertise in **full-stack development** and **automation solutions**.

## Key Features

- **User Management:** Registration, login, profile management, and role-based access.  
- **Contacts & Customers:** Create, edit, and link contacts to customers.  
- **Deals Pipeline:** Drag-and-drop pipeline management with stage updates.  
- **Email Automation:** Send emails programmatically through the backend.  
- **Calendar Automation:** Add events to Google Calendar using OAuth 2.0.  
- **Data Visualization:** Charts and reports for sales and deal tracking.  
- **Responsive Design:** Mobile-first layout for seamless usage across devices.  

## Architecture & Technology Stack

### Frontend
- **React 19** with **Vite** for fast development and optimized builds  
- **DnD-kit** for drag-and-drop deal pipelines  
- **Chart.js** and **react-chartjs-2** for interactive charts  
- **React Router 7** for SPA routing and protected routes  
- **Context API** for global state management  

### Backend
- **Node.js & Express 5** for server-side APIs  
- **MongoDB & Mongoose** for database modeling and data validation  
- **JWT & bcrypt** for secure authentication  
- **Nodemailer** for email automation  
- **Google APIs** for calendar integration  

### Automation
- Sending automated emails to contacts or deals  
- Adding events and reminders to Google Calendar  
- Centralized workflow for CRM actions without manual intervention  

### Folder Structure (Simplified)
* /client # React frontend
* /components
* /pages
* /styles
* /context
* /server # Node.js backend
* /models
* /routes
* /controllers
* /utils

## Data Models & Flow

- **User:** Handles authentication, roles, and profile management.  
- **Contact:** Individuals linked to customers for email and scheduling.  
- **Customer:** Companies with multiple contacts and deals.  
- **Deal:** Tracks sales opportunities, stages, and associated contacts/customers.  
- **Activity:** Records key business events, such as emails and calendar events. 

Frontend state management uses **React Context** to propagate user and app state, while the backend ensures secure data storage and automated actions.

## Process / Workflow

1. **Authentication:** Users register and log in securely using hashed passwords and JWT tokens.  
2. **CRUD Operations:** Users can create, update, view, and delete contacts, customers, and deals.  
3. **Automation:** Emails and calendar events are triggered programmatically via backend endpoints.  
4. **Interactive UI:** Drag-and-drop pipeline updates automatically update deal stages in the backend.  
5. **Protected Routes:** Certain routes are accessible only to authenticated users, enforced via React Router and Context state.  

## Business Value

- **Time Savings:** Automates repetitive tasks such as emailing and scheduling.  
- **Centralized Management:** All contacts, customers, and deals in a single platform.  
- **Data-Driven Decisions:** Visual dashboards help teams monitor performance and make informed choices.  
- **Scalability:** Designed to integrate additional automation features as the business grows.

## Installation & Setup

### Backend
1. Clone the repository:  
   ```bash
   git clone <repo-url>
   cd server
2. Install dependencies:
npm install
3. Configure .env file:
MONGODB_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
4. Run server:
npm run dev

### Frontend
1. Navigate to client:
cd client
2. Install dependencies:
npm install
3. Start development server:
npm run dev

## Future Work
* Integrate AI-based deal scoring and recommendations.
* Expand analytics dashboards with predictive insights.
* Add automated notifications, webhooks and workflow triggers.
* Implement real-time collaboration features for teams.

## Limitations
* Current MVP does not include multi-tenancy.
* Automation features are limited to email and calendar for now.
* Larger scale analytics and reporting are planned for future versions.

## Technology Used

### Frontend
React, Vite, DnD-kit, Chart.js, React Router, React Icons

### Backend
Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, Google APIs

### Utilities
dotenv, axios, body-parser, cors, nodemon