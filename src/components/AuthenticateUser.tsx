import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "../context/context";
import { useAwaitableNavigation } from "../hooks/useAwaitableNavigation";
import { useApprovalStore } from "../stores/approvalStore";

export const AuthenticateUser = () => {
  const { url } = useContext(AppContext);
  const [approved, setApproved] = useState<boolean | null>(null);
  const navigatePromise = useAwaitableNavigation();
  const { setApprovalData } = useApprovalStore();

  const authenticateUser = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();

    // 1. Set the approval data in the store
    const navigationId = setApprovalData(data.title);

    // 2. Navigate to the approval page
    const approved = await navigatePromise<boolean>("/approval", navigationId);
    // 3. Set the approved state
    setApproved(approved);
  };

  const reset = () => {
    setApproved(null);
  };

  return (
    <div className="card">
      {approved === true && (
        <>
          <p>User approved</p>
          <button onClick={reset}>Reset</button>
        </>
      )}
      {approved === false && (
        <>
          <p>User rejected</p>
          <button onClick={reset}>Reset</button>
        </>
      )}
      {approved === null && (
        <button onClick={authenticateUser}>Authenticate User</button>
      )}
      <Outlet />
    </div>
  );
};
