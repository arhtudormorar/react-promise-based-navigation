import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import { getUserApproval } from "./ComponentLoader/getUserApproval";

export const AuthenticateUser = () => {
  const { url } = useContext(AppContext);
  const [approved, setApproved] = useState<boolean | null>(null);

  const authenticateUser = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();
    const approved = await getUserApproval(data.title);
    setApproved(approved);
  };

  const reset = () => {
    setApproved(null);
  };

  switch (approved) {
    case true:
      return (
        <div className="card">
          User approved
          <br />
          <button onClick={reset}>Reset</button>
        </div>
      );
    case false:
      return (
        <div className="card">
          User rejected
          <br />
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

  return <></>;
};
