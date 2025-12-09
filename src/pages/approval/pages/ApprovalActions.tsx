import { useNavigate, useLocation } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import { useAwaitableNavigation } from "../../../hooks/useAwaitableNavigation";
import { Loader } from "./Loader";

export const ApprovalActions = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navigatePromise = useAwaitableNavigation();

  // Get the base path (remove /loader if present)
  const basePath = pathname.replace(/\/loader$/, "");

  const handleApprove = async () => {
    const loaderPath = `${basePath}/loader`;
    await navigatePromise(loaderPath, <Loader action="approve" />);
    // After loader resolves, resolve the parent approval navigation
    resolveNavigation(basePath, true);
    navigate("..");
  };

  const handleReject = async () => {
    const loaderPath = `${basePath}/loader`;
    await navigatePromise(loaderPath, <Loader action="reject" />);
    // After loader resolves, resolve the parent approval navigation
    resolveNavigation(basePath, false);
    navigate("..");
  };

  return (
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
  );
};
