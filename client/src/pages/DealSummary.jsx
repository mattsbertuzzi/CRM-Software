import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import "../styles/summary.css";
import "../styles/dealStage.css";

import { DealContext } from "../context/DealContext";
import { CustomerContext } from "../context/CustomerContext";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ================= DEAL CARD ================= */

const DealCard = ({ deal }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px 12px",
    marginBottom: "8px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "grab"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {deal.name}
    </div>
  );
};

/* ================= PIPELINE COLUMN ================= */

const PipelineColumn = ({ stage, deals }) => {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={`pipeline-column stage-${stage.toLowerCase().replace(" ", "-")}`}
    >
      <h4>{stage}</h4>

      <SortableContext
        items={deals.map(d => d.id)}
        strategy={verticalListSortingStrategy}
      >
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </SortableContext>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const stagesOrder = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
];

const DealSummary = () => {
  const { id } = useParams();

  const { fetchOneDeal, updateDeal } = useContext(DealContext);
  const { getCustomers } = useContext(CustomerContext);

  const [deal, setDeal] = useState(null);
  const [pipeline, setPipeline] = useState({});
  const [customers, setCustomers] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* ---------- LOAD DATA ---------- */

  useEffect(() => {
    async function loadData() {
      const dealData = await fetchOneDeal(id);
      const customerList = await getCustomers();

      setCustomers(customerList);

      const normalizedStage =
        stagesOrder.find(
          s =>
            s.toLowerCase() ===
            dealData.stage.replace("-", " ").toLowerCase()
        ) || "Lead";

      const dealObj = {
        id: dealData.id,
        name: dealData.title,
        value: dealData.value,
        stage: normalizedStage,
        customer: dealData.customer
      };

      setDeal(dealObj);

      const initialPipeline = {};
      stagesOrder.forEach(stage => {
        initialPipeline[stage] = stage === normalizedStage ? [dealObj] : [];
      });

      setPipeline(initialPipeline);
    }

    loadData();
  }, [id]);

  if (!deal) return <div>Loading...</div>;

  /* ---------- FORM HANDLERS ---------- */

  const handleFieldChange = e => {
    const { name, value } = e.target;
    setDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = e => {
    setDeal(prev => ({ ...prev, customer: e.target.value || null }));
  };

  const handleSave = async () => {
    await updateDeal(deal.id, {
      title: deal.name,
      value: deal.value,
      stage: deal.stage.toLowerCase().replace(" ", "-"),
      customer: deal.customer
    });

    alert("Deal saved");
  };

  /* ---------- DRAG END ---------- */

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceStage = stagesOrder.find(stage =>
      pipeline[stage].some(d => d.id === active.id)
    );

    const destinationStage = over.id;

    if (!sourceStage || sourceStage === destinationStage) return;

    const movedDeal = pipeline[sourceStage].find(
      d => d.id === active.id
    );

    setPipeline(prev => ({
      ...prev,
      [sourceStage]: prev[sourceStage].filter(d => d.id !== active.id),
      [destinationStage]: [...prev[destinationStage], movedDeal]
    }));

    setDeal(prev => ({ ...prev, stage: destinationStage }));
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>{deal.name}</h2>
        <Button variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* Deal Info */}
      <div className="summary-section">
        <h3>Deal Information</h3>

        <div className="summary-field">
          <label>Name</label>
          <input name="name" value={deal.name} onChange={handleFieldChange} />
        </div>

        <div className="summary-field">
          <label>Value</label>
          <input
            type="number"
            name="value"
            value={deal.value}
            onChange={handleFieldChange}
          />
        </div>

        <div className="summary-field">
          <label>Customer</label>
          <select value={deal.customer || ""} onChange={handleCustomerChange}>
            <option value="">— None —</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>
                {c.firstName} {c.lastName} ({c.company || "No Company"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline */}
      <div className="summary-section">
        <h3>Pipeline</h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="pipeline-container">
            {stagesOrder.map(stage => (
              <PipelineColumn
                key={stage}
                stage={stage}
                deals={pipeline[stage] || []}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default DealSummary;
