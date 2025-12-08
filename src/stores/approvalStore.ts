import { create } from "zustand";

interface ApprovalData {
  text: string;
  navigationId: string;
}

interface ApprovalStore {
  approvalData: ApprovalData | null;
  setApprovalData: (text: string | null) => string;
}

export const useApprovalStore = create<ApprovalStore>((set) => ({
  approvalData: null,
  setApprovalData: (text: string | null) => {
    const navigationId = Date.now().toString();
    set({ approvalData: text ? { text, navigationId } : null });
    return navigationId;
  },
}));
