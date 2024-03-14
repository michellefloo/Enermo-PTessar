import React, { useState, useEffect } from "react";
import { useGetUtilityList } from "src/api/utility";

const MonitoredUtilityList = ({ id_device }) => {
  const { data: rqData, status: rqStatus } = useGetUtilityList();
  const [utilityData, setUtilityData] = useState([]);
  useEffect(() => {
    if (rqStatus === "success") {
      if (!rqData) return;
      if (!rqData.result) return;
      setUtilityData(
        rqData.result.filter((item) => item.id_device === id_device)
      );
    }
  }, [rqData, rqStatus, id_device]);

  return (
    <>
      <div className="bg-info text-lg-center font-weight-bold mb-2">
        Monitored Utility
      </div>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        <table className="table table-hover table-outline mb-0 d-none d-sm-table">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Wattage</th>
              <th>Usage Type</th>
            </tr>
          </thead>
          <tbody>
            {utilityData.map((item, index) => (
              <tr key={index}>
                <td>{item.utility_name}</td>
                <td>{item.utility_type_name}</td>
                <td>{item.utility_wattage}</td>
                <td>{item.resource_usage_type_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default MonitoredUtilityList;
