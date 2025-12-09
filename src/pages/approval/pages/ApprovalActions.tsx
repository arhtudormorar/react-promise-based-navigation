import { useNavigate } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import { useAwaitableNavigation } from "../../../hooks/useAwaitableNavigation";
import { Loader } from "./Loader";

export const ApprovalActions = () => {
  const navigate = useNavigate();
  const navigatePromise = useAwaitableNavigation();

  const handleApprove = async () => {
    const isApproved = await navigatePromise(
      "/approval/loader",
      <Loader isApproving={true} />
    );
    resolveNavigation(isApproved);
    navigate("/", { replace: true });
  };

  const handleReject = async () => {
    const isRejected = await navigatePromise(
      "/approval/loader",
      <Loader isApproving={false} />
    );
    resolveNavigation(isRejected);
    navigate("/", { replace: true });
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
