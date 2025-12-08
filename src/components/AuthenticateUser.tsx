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

    const navigationId = Date.now().toString();

    setApprovalData({ text: data.title, navigationId });

    const approved = await navigatePromise<boolean>("/approval", navigationId);
    setApprovalData(null);
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
