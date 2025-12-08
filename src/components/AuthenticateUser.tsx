import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import { getUserApproval } from "./UserModal/getUserApproval";
import { useAwaitableNavigation } from "../hooks/useAwaitableNavigation";

export const AuthenticateUser = () => {
  const { url } = useContext(AppContext);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [method, setMethod] = useState<"modal" | "route">("modal");
  const navigatePromise = useAwaitableNavigation();

  const authenticateUserModal = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();
    const approved = await getUserApproval(data.title);
    setApproved(approved);
  };

  const authenticateUserRoute = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();
    const approved = await navigatePromise<boolean>("/approval", {
      text: data.title,
    });
    setApproved(approved);
  };

  const authenticateUser = async () => {
    if (method === "modal") {
      await authenticateUserModal();
    } else {
      await authenticateUserRoute();
    }
  };

  const reset = () => {
    setApproved(null);
  };

  switch (approved) {
    case true:
      return (
        <div className="card">
          <p>User approved ({method} method)</p>
          <button onClick={reset}>Reset</button>
        </div>
      );
    case false:
      return (
        <div className="card">
          <p>User rejected ({method} method)</p>
          <button onClick={reset}>Reset</button>
        </div>
      );
    default:
      return (
        <div className="card">
          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                type="radio"
                checked={method === "modal"}
                onChange={() => setMethod("modal")}
                style={{ marginRight: "8px" }}
              />
              Modal-based (overlay)
            </label>
            <br />
            <label>
              <input
                type="radio"
                checked={method === "route"}
                onChange={() => setMethod("route")}
                style={{ marginRight: "8px" }}
              />
              Route-based (navigation)
            </label>
          </div>
          <button onClick={authenticateUser}>Authenticate User</button>
        </div>
      );
  }
};
