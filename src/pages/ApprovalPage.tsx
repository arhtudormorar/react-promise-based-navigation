import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";
import {
  resolveNavigation,
  rejectNavigation,
} from "../utils/navigationPromiseManager";
import { useApprovalStore } from "../stores/approvalStore";
import "./ApprovalPage.css";

export const ApprovalPage = () => {
  const navigate = useNavigate();
  const { url } = useContext(AppContext);
  const { approvalData, setApprovalData } = useApprovalStore();

  // Handle case where user navigated directly (no store data)
  if (!approvalData?.navigationId || !approvalData?.text) {
    return (
      <div className="approval-page">
        <div className="approval-content">
          <h2>Invalid Navigation</h2>
          <p>This page requires navigation state. Please go back.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const { text, navigationId } = approvalData;

  const handleApprove = () => {
    resolveNavigation(navigationId, true);
    setApprovalData(null);
    navigate(-1);
  };

  const handleReject = () => {
    resolveNavigation(navigationId, false);
    setApprovalData(null);
    navigate(-1);
  };

  const handleClose = () => {
    rejectNavigation(navigationId, new Error("User closed approval page"));
    setApprovalData(null);
    navigate(-1);
  };

  return (
    <div className="approval-page">
      <div className="approval-content">
        <button
          className="approval-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="approval-body">
          <p>URL: {url}</p>
          <p>{text}</p>
        </div>
        <div className="approval-actions">
          <button
            className="approval-button approval-button-reject"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="approval-button approval-button-approve"
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};
