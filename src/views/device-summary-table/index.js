import React from "react";
import DeviceSummaryProvider from "./_provider/DeviceSummaryProvider";
import DeviceSummaryTable from "./DeviceSummaryTable";

const Dashboard = () => {
  return (
    <DeviceSummaryProvider>
      <DeviceSummaryTable />
    </DeviceSummaryProvider>
  );
};

export default Dashboard;
