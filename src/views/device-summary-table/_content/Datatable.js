import React, { Fragment, useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import CIcon from "@coreui/icons-react";
import { cilChart } from "@coreui/icons";
import {
  CDataTable,
  CInputCheckbox,
  CInput,
  CButton,
  CContainer,
} from "@coreui/react";

import { useHistory } from "react-router-dom";
import { useGetDeviceList } from "src/api/device";
import { useGetDeviceMonitoring } from "src/api/dashboard";
import { TimeConfigProviderContext } from "../../dashboard/_provider/TimeConfigProvider";

const SelectionColumnSLot = (props) => {
  const { onSelected } = props;
  return (
    <CInput
      type="checkbox"
      size="sm"
      onChange={(e) => {
        onSelected(e.target.checked);
      }}
    />
  );
};

const SelectionSlot = (props) => {
  const { data, onSelected } = props;
  return (
    <td>
      <CInputCheckbox
        className="mx-auto"
        checked={data._checked || false}
        onChange={(e) => {
          onSelected(e.target.checked, data.id);
        }}
      />
    </td>
  );
};

const ActionButtonSlot = (props) => {
  const { toggleDeviceSummaryDetail, data } = props;
  return (
    <td>
      <CContainer className="d-flex justify-content-end" fluid>
        <div className="p-1">
          <CButton
            color="info"
            block
            className="d-flex align-items-center"
            onClick={() => toggleDeviceSummaryDetail(data)}
          >
            <CIcon content={cilChart} />
            <span>&nbsp;Detail</span>
          </CButton>
        </div>
      </CContainer>
    </td>
  );
};

const DeviceSummaryDataTable = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);

  const [deviceData, setDeviceData] = useState([]);
  const [listID, setlistID] = useState([]);
  const [isSelectAllSelected, setSelectAllSelected] = useState(false);

  const { data: listData, status: listStatus } = useGetDeviceList();
  console.log("🚀 ~ DeviceSummaryDataTable ~ listData:", listData);
  const { data: monitorData, status: monitorStatus } = useGetDeviceMonitoring(
    listID[0],
    null,
    deviceMonitorTime && deviceMonitorTime.start,
    deviceMonitorTime && deviceMonitorTime.end
  );
  /*
  1. dari listData didapat listID, (DONE)
  2. lalu listID dijadikan sebagai parameter ke useGetDeviceMonitoring dan menghasilkan monitorData, (Baru get 1 ID, how to get the enitre data from monitoring for each id in the listID?? aku sudah coba...dan stuck)
  3. lalu dari monitorData didapatkan field2 yg dibutuhkan,
  4. lalu field2 tersebut dimasukan ke setDeviceData
  5. dan deviceData akan dishow ke table
  */
  useEffect(() => {
    if (listStatus === "success") {
      if (!listData) return;
      if (!listData.result) return;
      const ids = listData.result.map((item) => item.id); // ambil hanya id dari listData
      setlistID(ids); // masukan id2 tadi ke listID
    }
  }, [listData, listStatus]);
  console.log("🚀 ~ DeviceSummaryDataTable ~ listID:", listID);

  useEffect(() => {
    dispatch({
      type: "exportFromCoreUIDataTable",
      fields: [
        { key: "id_main_customer", label: "Customer ID" },
        { key: "device_desc", label: "Device Name" },
        { key: "device_name", label: "Device Code" },
        { key: "status", label: "Status" },
        { key: "cycle", label: "Cycle" },
        { key: "billing", label: "Billing" },
      ],
      data: deviceData,
      fileName: "Device List",
    });
  }, [deviceData, dispatch]);

  const fields = [
    { key: "selection", label: "", filter: false, _style: { width: "2%" } },
    { key: "id_main_customer", label: "Customer ID", _style: { width: "15%" } },
    { key: "device_desc", label: "Device Name", _style: { width: "15%" } },
    { key: "device_name", label: "Device Code", _style: { width: "10%" } },
    { key: "status", label: "Status", _style: { width: "10%" } },
    { key: "cycle", label: "Cycle", _style: { width: "15%" } },
    { key: "billing", label: "Billing", _style: { width: "15%" } },
    { key: "action", label: "Action", filter: false, _style: { width: "10%" } },
  ];

  const columnFilterSlot = {
    selection: <SelectionColumnSLot onSelected={handleSelectAll} />,
  };

  const scopedSlots = {
    selection: (item) => (
      <SelectionSlot data={item} onSelected={handleSelect} />
    ),
    action: (item) => (
      <ActionButtonSlot
        data={item}
        toggleDeviceSummaryDetail={handleDeviceSummaryTable}
      />
    ),
  };

  const handleDeviceSummaryTable = (data) => {
    history.push({
      pathname: "/dashboard",
      state: {
        device_id: data.id,
        device: data,
        device_name: data.device_desc,
      },
    });
  };

  const handleSelectAll = (isSelected) => {
    setSelectAllSelected(isSelected);
    setDeviceData((currentData) => {
      return currentData.map((d) => ({ ...d, _checked: isSelected }));
    });
  };

  const handleSelect = (isSelected, listID) => {
    setDeviceData((currentData) => {
      const findIndex = currentData.findIndex((d) => d.id === listID);
      currentData[findIndex]._checked = isSelected;
      return [...currentData];
    });
  };
  const handleColumnFilterChange = (e) => {
    if (listStatus !== "success") {
      return;
    }
    let isFilterEmpty = true;
    const eKeys = Object.keys(e);
    for (let i = 0; i < eKeys.length; i++) {
      if (e[eKeys[i]].length > 0) {
        isFilterEmpty = false;
        break;
      }
    }
    if (isFilterEmpty) {
      setDeviceData(listData.result);
    }
    if (isSelectAllSelected) {
      handleSelectAll(true);
    }
  };

  const handleOnFilteredItemsChange = (items) => {
    if (listStatus !== "success") {
      return;
    }
    if (items.length === 0) {
      setDeviceData(listData.result);
      return;
    }
    setDeviceData(items);
  };

  return (
    <Fragment>
      <CDataTable
        items={deviceData}
        responsive
        fields={fields}
        columnFilterSlot={columnFilterSlot}
        scopedSlots={scopedSlots}
        columnFilter
        itemsPerPage={15}
        loading={listStatus === "loading"}
        onColumnFilterChange={(e) => handleColumnFilterChange(e)}
        onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
        hover
        sorter
        pagination
      />
    </Fragment>
  );
};

export default DeviceSummaryDataTable;
