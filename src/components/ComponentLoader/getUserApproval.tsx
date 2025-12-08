import { setComponentLoader } from "./helpers/setComponentLoader";
import { UserModal } from "./UserModal";

export async function getUserApproval(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const handleSubmit = (approved: boolean) => {
      setComponentLoader(null);
      resolve(approved);
    };

    const handleClose = () => {
      setComponentLoader(null);
      reject(new Error("Guardian modal closed"));
    };

    setComponentLoader(
      <UserModal
        text={text}
        onApprove={() => handleSubmit(true)}
        onReject={() => handleSubmit(false)}
        onClose={handleClose}
      />
    );
  });
}
