import React from "react";
import { CRow, CCol, CWidgetIcon, CSpinner } from "@coreui/react";
import {
  useGetUserManagementUsersAllCount,
  useGetUserManagementUsersLockCount,
  useGetUserManagementUnverifiedCount,
} from "../../../api/user-management";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser, cilX } from "@coreui/icons";

const UserManegementHeaderCounter = () => {
  const { data: rqDataUserManAllCount, status: rqStatusUserManAllCount } =
    useGetUserManagementUsersAllCount(0);
  const { data: rqDataUserManLockCount, status: rqStatusUserManLockCount } =
    useGetUserManagementUsersLockCount(0);
  const {
    data: rqDataUserManUnverifiedCount,
    status: rqStatusUserManUnverifiedCount,
  } = useGetUserManagementUnverifiedCount(0);

  if (
    rqStatusUserManAllCount === "loading" ||
    rqStatusUserManLockCount === "loading" ||
    rqStatusUserManUnverifiedCount === "loading"
  ) {
    return (
      <CCol xs="12" sm="6" lg="4">
        <CSpinner
          className="spinner spinner--spacer-bottom"
          color="primary"
          variant="grow"
        />
      </CCol>
    );
  }

  return (
    <CRow>
      <CCol xs="12" sm="4" lg="4">
        <CWidgetIcon
          header={String(rqDataUserManAllCount)}
          text="Total User"
          color="info"
        >
          <CIcon width={24} content={cilUser} />
        </CWidgetIcon>
      </CCol>
      <CCol xs="12" sm="4" lg="4">
        <CWidgetIcon
          header={String(rqDataUserManLockCount)}
          text="Locked User(s)"
          color="warning"
        >
          <CIcon width={24} content={cilLockLocked} />
        </CWidgetIcon>
      </CCol>
      <CCol xs="12" sm="4" lg="4">
        <CWidgetIcon
          header={String(rqDataUserManUnverifiedCount)}
          text="Unverified User(s)"
          color="danger"
        >
          <CIcon width={24} content={cilX} />
        </CWidgetIcon>
      </CCol>
    </CRow>
  );
};

export default UserManegementHeaderCounter;
