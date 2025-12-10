import { useContext } from "react";
import { AppContext } from "../../context/context";
import { rejectNavigation } from "../../utils/navigationPromiseManager";
import { useLocation as wouterLocation } from "wouter";
import { Outlet } from "../../components/Outlet";
import { ApprovalActions } from "./pages/ApprovalActions";
import "./ApprovalPage.css";

interface ApprovalPageProps {
  text: string;
}

export const ApprovalPage = ({ text }: ApprovalPageProps) => {
  const [location, wNavigate] = wouterLocation();
  const { url } = useContext(AppContext);

  const handleClose = () => {
    rejectNavigation(location, new Error("User closed approval page"));
    wNavigate("/");
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
          <Outlet parentPath="/approval">
            <ApprovalActions />
          </Outlet>
        </div>
      </div>
    </div>
  );
};
