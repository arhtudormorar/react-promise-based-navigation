import { useContext } from "react";
import { AppContext } from "../context/context";
import { getUserApproval } from "./ComponentLoader/getUserApproval";

export const AuthenticateUser = () => {
  const { url } = useContext(AppContext);

  const authenticateUser = async () => {
    const response = await fetch(`${url}/todos/1`);
    const data: { title: string } = await response.json();
    const approved = await getUserApproval(data.title);
    console.log(approved);
  };

  return (
    <>
      <div className="card">
        <button onClick={authenticateUser}>Authenticate User</button>
      </div>
    </>
  );
};
