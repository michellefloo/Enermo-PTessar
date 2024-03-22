import React, { Fragment, useState, useEffect } from "react";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import { useGetDeviceGroupList } from "src/api/device-group";
import DeviceCard from "../device-card/DeviceCard";
import BigSpinner from "src/components/ui/big-spinner/BigSpinner";
import { useGetDeviceGroupDetailList } from "src/api/device-group-detail";

const DeviceGroupTab = ({ children }) => {
  const { data: deviceGroupData, status: deviceGroupStatus } =
    useGetDeviceGroupList();
  const { data: deviceGroupDetailData, status: deviceGroupDetailStatus } =
    useGetDeviceGroupDetailList();
  const [activeTab, setActiveTab] = useState(-1);
  useEffect(() => {
    if (
      deviceGroupDetailStatus === "success" &&
      deviceGroupStatus === "success" &&
      deviceGroupData.result.length > 0
    ) {
      setActiveTab(
        deviceGroupData.result ? "tab_" + deviceGroupData.result[0].id : -1
      );
    }
  }, [
    deviceGroupDetailStatus,
    deviceGroupDetailData,
    deviceGroupStatus,
    deviceGroupData,
  ]);

  if (
    deviceGroupStatus !== "success" ||
    deviceGroupDetailStatus !== "success"
  ) {
    return <BigSpinner />;
  }

  return (
    <>
      <CTabs
        activeTab={activeTab}
        onActiveTabChange={(tabName) => setActiveTab(tabName)}
      >
        <CNav variant="tabs">
          {deviceGroupData.result.map((d, index) => (
            <CNavItem key={index + 1}>
              <CNavLink data-tab={"tab_" + d.id}>{d.group_name}</CNavLink>
            </CNavItem>
          ))}
        </CNav>
        <CTabContent style={{ width: "100%" }}>
          {deviceGroupData.result.map((d, index) => (
            <CTabPane data-tab={"tab_" + d.id} key={index + 1}>
              <br />
              <Fragment>
                <DeviceCard
                  devices={[
                    ...deviceGroupDetailData.result.filter(
                      (dg) => Number(dg.id_group_devices) === Number(d.id)
                    ),
                  ]}
                />
              </Fragment>
            </CTabPane>
          ))}
        </CTabContent>
      </CTabs>
    </>
  );
};

export default DeviceGroupTab;
