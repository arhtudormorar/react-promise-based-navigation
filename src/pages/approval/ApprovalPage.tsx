import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/context";
import { rejectNavigation } from "../../utils/navigationPromiseManager";
import "./ApprovalPage.css";

interface ApprovalPageProps {
  text: string;
}

export const ApprovalPage = ({ text }: ApprovalPageProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { url } = useContext(AppContext);

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

  const handleClose = () => {
    rejectNavigation(pathname, new Error("User closed approval page"));
    navigate("..", { replace: true });
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};
