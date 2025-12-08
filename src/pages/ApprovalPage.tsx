import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";
import {
  resolveNavigation,
  rejectNavigation,
} from "../utils/navigationPromiseManager";
import "./ApprovalPage.css";

export const ApprovalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url } = useContext(AppContext);
  const { text, __navigationId } =
    (location.state as {
      text?: string;
      __navigationId?: string;
    }) || {};

  // Handle case where user navigated directly (no state)
  if (!__navigationId || !text) {
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

  const handleApprove = () => {
    resolveNavigation(__navigationId, true);
    navigate(-1);
  };

  const handleReject = () => {
    resolveNavigation(__navigationId, false);
    navigate(-1);
  };

  const handleClose = () => {
    rejectNavigation(__navigationId, new Error("User closed approval page"));
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
