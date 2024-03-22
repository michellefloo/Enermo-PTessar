import React, { Fragment, useState } from "react";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import { useGetSensorList } from "../../../../api/sensor";
import { countSensorProduct } from "../../../../utils/helpers";
import BigSpinner from "../../../../components/ui/big-spinner/BigSpinner";
import cardObj from "../sensor-product-summary-card/";

const SensorProductSummaryTab = () => {
  const [activeTab, setActiveTab] = useState("kwh");
  const { data: sensorList, isLoading: sensorListLoading } = useGetSensorList();
  const [sensorProductCount, setSensorProductCount] = useState(null);

  if (sensorListLoading) return <BigSpinner text="load sensor data..." />;
  if (!sensorList) return null;
  if (!sensorList.result) return null;
  if (!sensorProductCount) {
    setSensorProductCount(countSensorProduct(sensorList.result));
    return <BigSpinner text="counting sensor param..." />;
  }
  return (
    <>
      <CTabs
        activeTab={activeTab}
        onActiveTabChange={(tabName) => setActiveTab(tabName)}
      >
        <CNav variant="tabs">
          {Object.keys(sensorProductCount).map(
            (key, index) =>
              sensorProductCount[key] > 0 && (
                <Fragment key={index + 1}>
                  <CNavItem>
                    <CNavLink data-tab={key}>{key.toUpperCase()}</CNavLink>
                  </CNavItem>
                </Fragment>
              )
          )}
        </CNav>
        <CTabContent style={{ width: "100%" }}>
          {Object.keys(sensorProductCount).map(
            (key, index) =>
              sensorProductCount[key] > 0 && (
                <Fragment key={index + 1}>
                  <CTabPane data-tab={key}>
                    <br />
                    {cardObj[key]}
                  </CTabPane>
                </Fragment>
              )
          )}
        </CTabContent>
      </CTabs>
    </>
  );
};

export default SensorProductSummaryTab;
