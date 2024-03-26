import React, { Fragment } from "react";
import Datatable from "./_contents/Datatable";
import { CCard, CCardBody, CRow, CCol } from "@coreui/react";
import HeaderWidget from "./_contents/HeaderWidget";
import ActionButtonContainer from "./_contents/ActionButtonsContainer";
import UserManagementErrorHandler from "./_contents/ErrorHandler";
import {
  AddUserModal,
  LockUserModal,
  ResetPasswordModal,
  DeleteAccountModal,
  ResendEmailModal,
} from "./_contents/Modals";

const UserManagement = () => {
  return (
    <Fragment>
      <CRow>
        <ActionButtonContainer />
        <CCol>
          <HeaderWidget />
        </CCol>
        {/* <CCol></CCol> */}
      </CRow>
      <CCard>
        <CCardBody>
          <Datatable />
        </CCardBody>
      </CCard>
      <AddUserModal />
      <LockUserModal />
      <ResetPasswordModal />
      <DeleteAccountModal />
      <ResendEmailModal />
      <UserManagementErrorHandler />
    </Fragment>
  );
};

export default UserManagement;
