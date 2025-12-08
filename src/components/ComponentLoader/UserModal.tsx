import "./UserModal.css";

interface UserModalProps {
  text: string;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const UserModal = ({
  text,
  onApprove,
  onReject,
  onClose,
}: UserModalProps) => {
  return (
    <div className="user-modal-overlay">
      <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="user-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="user-modal-body">
          <p>{text}</p>
        </div>
        <div className="user-modal-actions">
          <button
            className="user-modal-button user-modal-button-reject"
            onClick={onReject}
          >
            Reject
          </button>
          <button
            className="user-modal-button user-modal-button-approve"
            onClick={onApprove}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};
