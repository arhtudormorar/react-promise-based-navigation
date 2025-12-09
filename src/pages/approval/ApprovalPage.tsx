import { useNavigate, Outlet, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/context";
import { rejectNavigation } from "../../utils/navigationPromiseManager";
import { DynamicRoute } from "../../components/DynamicRoute";
import { ApprovalActions } from "./pages/ApprovalActions";
import { routeNames } from "../../routes/routeNames";
import "./ApprovalPage.css";

interface ApprovalPageProps {
  text: string;
}

export const ApprovalPage = {
  Component: ({ text }: ApprovalPageProps) => {
    const navigate = useNavigate();
    const { url } = useContext(AppContext);

    const handleClose = () => {
      rejectNavigation(new Error("User closed approval page"));
      navigate(routeNames.home, { replace: true });
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
  },
  Outlet: (
    <>
      <Route index element={<ApprovalActions />} />
      <Route path="loader" element={<DynamicRoute />} />
    </>
  ),
};
