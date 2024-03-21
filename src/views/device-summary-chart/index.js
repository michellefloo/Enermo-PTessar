import React from "react";
import DeviceSummaryChartProvider from "./_provider/DeviceSummaryChartProvider";
import DeviceSummaryChart from "./DeviceSummaryChart";

const Dashboard = () => {
  return (
    <DeviceSummaryChartProvider>
      <DeviceSummaryChart />
    </DeviceSummaryChartProvider>
  );
};

export default Dashboard;
