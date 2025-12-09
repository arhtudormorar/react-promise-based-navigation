import { AuthenticateUser } from "../pages/authenticate/AuthenticateUser.tsx";
import { ApprovalPage } from "../pages/approval/ApprovalPage.tsx";
import { ApprovalActions } from "../pages/approval/pages/ApprovalActions.tsx";
import { routeNames } from "./routeNames.ts";
import { Loader } from "../pages/approval/pages/Loader.tsx";

export const routes = {
  [routeNames.home]: AuthenticateUser.Component,
  [`/${routeNames.approval}`]: ApprovalPage.Component,
  [`/${routeNames.approvalActions}`]: ApprovalActions,
  [`/${routeNames.approvalLoader}`]: Loader,
} as const;
