import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";
import {
  resolveNavigation,
  rejectNavigation,
  getCurrentNavigationId,
} from "../utils/navigationPromiseManager";
import "./ApprovalPage.css";

interface ApprovalPageProps {
  text: string;
}

export const ApprovalPage = ({ text }: ApprovalPageProps) => {
  const navigate = useNavigate();
  const { url } = useContext(AppContext);
  const navigationId = getCurrentNavigationId();

  if (!navigationId) {
    return (
      <div className="approval-page">
        <div className="approval-content">
          <h2>Invalid Navigation</h2>
          <p>Navigation ID not found. Please go back.</p>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    resolveNavigation(navigationId, true);
    navigate("..");
  };

  const handleReject = () => {
    resolveNavigation(navigationId, false);
    navigate("..");
  };

  const handleClose = () => {
    rejectNavigation(navigationId, new Error("User closed approval page"));
    navigate("..");
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
