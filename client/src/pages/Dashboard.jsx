import React, { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ContactContext } from "../context/ContactContext";
import { CustomerContext } from "../context/CustomerContext";
import { DealContext } from "../context/DealContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {

  const navigate = useNavigate();

  const ContactContextProvider = useContext(ContactContext);
  const CustomerContextProvider = useContext(CustomerContext);
  const DealContextProvider = useContext(DealContext);

  // Totals
  const totalDeals = DealContextProvider.getDealNumber();
  const totalDealValue = DealContextProvider.getDealValue();
  const totalCustomers = CustomerContextProvider.getCustomerNumber();
  const totalContacts = ContactContextProvider.getContactNumber();

  // Load data on mounting
  useEffect(() => {
    async function loadData() {
      await ContactContextProvider.getContacts();
      await CustomerContextProvider.getCustomers();
      await DealContextProvider.getDeals();
    };
    loadData()
  }, []);

  // Initialize deal stages
  const dealStageCount = {
    Lead: 0,
    Qualified: 0,
    Proposal: 0,
    Negotiation: 0,
    "Closed Won": 0,
    "Closed Lost": 0
  };

  // Map API stage values to display keys
  const stageMap = {
    lead: "Lead",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    "closed-won": "Closed Won",
    "closed-lost": "Closed Lost",
  };

  // Count deals by stage
  DealContextProvider.deals.forEach(d => {
    const key = stageMap[d.stage.toLowerCase()];
    if (key) dealStageCount[key] += 1;
  });

  const labelToApiStage = (label) =>
    label.toLowerCase().replace(" ", "-");  

  // Prepare chart data with pastel colors aligned to stages
  const chartData = {
    labels: Object.keys(dealStageCount),
    datasets: [
      {
        label: "Deals by Stage",
        data: Object.values(dealStageCount),
        backgroundColor: [
          "#fcd34d", // Lead - amber pastel
          "#fde68a", // Qualified - yellow pastel
          "#93c5fd", // Proposal - blue pastel
          "#6ee7b7", // Negotiation - green pastel
          "#5eead4", // Closed Won - teal pastel
          "#fca5a5"  // Closed Lost - red pastel
        ]
      }
    ]
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    onClick: (event, elements) => {
      if (!elements.length) return;
  
      const index = elements[0].index;
      const stageLabel = chartData.labels[index];
      const stage = labelToApiStage(stageLabel);
  
      navigate(`/deals?stage=${stage}`);
    }
  };  


  return (
    <div className="dashboard-container">
      <div className="cards-row">
        <div className="dashboard-card">
          <Link to="/deals">
            <h3>Total Deals</h3>
            <p>{totalDeals}</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/deals">
            <h3>Total Deal Value</h3>
            <p>${totalDealValue.toLocaleString()}</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/customers">
            <h3>Total Customers</h3>
            <p>{totalCustomers}</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/contacts">
            <h3>Total Contacts</h3>
            <p>{totalContacts}</p>
          </Link>
        </div>
      </div>

      <div className="chart-section">
        <h3>Deals by Stage</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;