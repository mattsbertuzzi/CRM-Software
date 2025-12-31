import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import AddDealModal from "../components/AddDealModal";
import "../styles/tables.css";
import "../styles/dealStage.css";
import { DealContext } from "../context/DealContext";
import { CustomerContext } from "../context/CustomerContext";

const Deals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterStage = searchParams.get('stage') || null;
  console.log("params: ",filterStage)

  // Context
  const DealContextProvider = useContext(DealContext);
  const { fetchAllDeals, createNewDeal } = DealContextProvider;
  const CustomerContextProvider = useContext(CustomerContext);

  // State
  const [deals, setDeals] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  /**
   * Fetch deals on mount + when deals change
   */
  useEffect(() => {
    async function fetchData() {
      // Fetch deals
      const fetchedData = await fetchAllDeals();
      let data = [];
      if (filterStage !== null) {
        data = await fetchedData.filter((d) =>
          d.stage === filterStage
        );
      } else {
        data = await fetchedData;
      };

      // Fetch customers (ensure async if needed)
      const allCustomers = await CustomerContextProvider.getCustomers();

      // Map deals to include full customer object
      const updatedDeals = data.map((deal) => {
        const dealCustomer = allCustomers.find(c => c._id === deal.customer);
        return {
          ...deal,
          customer: dealCustomer || null
        };
      });

      // Update state
      setDeals(updatedDeals);
    }

    fetchData();
  }, [DealContextProvider.getDealNumber?.()]);


  /**
   * Add new deal
   */
  const handleAddDeal = async (newDeal) => {
    await createNewDeal(newDeal);
    const updatedDeals = await fetchAllDeals();
    setDeals(updatedDeals);
    alert(`Deal ${newDeal.title} added!`);
    return null;
  };

  console.log(deals[0])
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>Deals</h2>
        <Button variant="primary" onClick={() => setAddModalOpen(true)}>
          + Add Deal
        </Button>
      </div>

      {/* Deals Table */}
      <div className="table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Stage</th>
              <th>Value</th>
              <th>Customer</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal._id}
                className="table-row"
                onClick={() => navigate(`/deals/${deal.id}`)}
              >
                <td>{deal.title}</td>

                <td>
                  <span
                    className={`deal-stage stage-${deal.stage
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {deal.stage}
                  </span>
                </td>

                <td>${Number(deal.value).toLocaleString()}</td>

                <td>
                  {deal.customer ? (
                    <span
                      className="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customers/${deal.customer.id}`);
                      }}
                    >
                      {deal.customer.firstName} {deal.customer.lastName}
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

      {/* Add Deal Modal */}
      {isAddModalOpen && (
        <AddDealModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddDeal={handleAddDeal}
          onCustomerReq={CustomerContextProvider.getCustomers}
        />
      )}
    </div>
  );
};

export default Deals;
