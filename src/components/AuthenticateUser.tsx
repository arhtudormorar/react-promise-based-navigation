import { useContext, useState } from "react";
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

  console.log(approved);

  switch (approved) {
    case true:
      return (
        <div className="card">
          <p>User approved</p>
          <button onClick={reset}>Reset</button>
        </div>
      );
    case false:
      return (
        <div className="card">
          <p>User rejected</p>
          <button onClick={reset}>Reset</button>
        </div>
      );
    default:
      return (
        <div className="card">
          <button onClick={authenticateUser}>Authenticate User</button>
        </div>
      );
  }
};
