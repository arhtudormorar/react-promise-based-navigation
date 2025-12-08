import { create } from "zustand";

interface ApprovalData {
  text: string;
  navigationId: string;
}

interface ApprovalStore {
  approvalData: ApprovalData | null;
  setApprovalData: (data: ApprovalData | null) => void;
}

export const useApprovalStore = create<ApprovalStore>((set) => ({
  approvalData: null,
  setApprovalData: (data) => set({ approvalData: data }),
}));
