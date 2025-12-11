import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import { useNavigationPromise } from "../../hooks/useNavigationPromise";
import { ApprovalPage } from "../approval/ApprovalPage";
import { Outlet } from "../../components/Outlet";

export const AuthenticateUser = () => {
  const { url } = useContext(AppContext);
  const [approved, setApproved] = useState<boolean | null>(null);
  const navigatePromise = useNavigationPromise();

  const authenticateUser = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();

    // Register the component with props and navigate
    const approved = await navigatePromise<boolean>(
      "/approval",
      <ApprovalPage text={data.title} />
    );

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
