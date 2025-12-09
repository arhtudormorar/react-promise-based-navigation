import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import {
  resolveNavigation,
  rejectNavigation,
} from "../utils/navigationPromiseManager";
import { Loader } from "./Loader";
import "./ApprovalPage.css";

interface ApprovalPageProps {
  text: string;
}

export const ApprovalPage = ({ text }: ApprovalPageProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { url } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  if (!pathname) {
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
    setIsLoading(true);
    setTimeout(() => {
      resolveNavigation(pathname, true);
      navigate("..");
    }, 2000);
  };

  const handleReject = () => {
    setIsLoading(true);
    setTimeout(() => {
      resolveNavigation(pathname, false);
      navigate("..");
    }, 2000);
  };

  const handleClose = () => {
    rejectNavigation(pathname, new Error("User closed approval page"));
    navigate("..");
  };

  return (
    <div className="approval-page">
      <div className="approval-content">
        <button
          className="approval-close"
          onClick={handleClose}
          aria-label="Close"
          disabled={isLoading}
        >
          ×
        </button>
        <div className="approval-body">
          <p>URL: {url}</p>
          <p>{text}</p>
        </div>
        <div
          className={`approval-actions ${
            isLoading ? "approval-actions-loading" : ""
          }`}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
