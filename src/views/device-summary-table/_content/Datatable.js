import React, { Fragment, useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useGetDeviceList } from "../../../api/device";
import CIcon from "@coreui/icons-react";
import { cilChart } from "@coreui/icons";
import {
  CCol,
  CRow,
  CDataTable,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CInputCheckbox,
  CInput,
  CButton,
  CContainer,
} from "@coreui/react";

import { useHistory } from "react-router-dom";
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
    <CContainer className="d-flex justify-content-end" fluid>
      <div className="p-1">
        <CButton
          color="info"
          block
          onClick={() => toggleDeviceSummaryDetail(data)}
        >
          <CIcon content={cilChart} /> Detail
        </CButton>
      </div>
    </CContainer>
  );
};

const DeviceSummaryDataTable = (id_device) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { data: rqData, status: rqStatus } = useGetDeviceList();
  // const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
  // const { data: rqData, status: rqStatus } = useGetDeviceMonitoring(
  //   id_device,
  //   null,
  //   deviceMonitorTime.start,
  //   deviceMonitorTime.end
  // );
  const [deviceData, setDeviceData] = useState([]);
  const [isSelecAllSelected, setSelecAllSelected] = useState(false);

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
    setSelecAllSelected(isSelected);
    setDeviceData((currentData) => {
      return currentData.map((d) => ({ ...d, _checked: isSelected }));
    });
  };

  const handleSelect = (isSelected, selectedId) => {
    setDeviceData((currentData) => {
      const findIndex = currentData.findIndex((d) => d.id === selectedId);
      currentData[findIndex]._checked = isSelected;
      return [...currentData];
    });
  };

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

  useEffect(() => {
    if (rqStatus === "success") {
      if (!rqData) return;
      if (!rqData.result) return;
      setDeviceData(rqData.result);
    }
  }, [rqData, rqStatus]);

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

  const handleColumnFilterChange = (e) => {
    if (rqStatus !== "success") {
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
      setDeviceData(rqData.result);
    }
    if (isSelecAllSelected) {
      handleSelectAll(true);
    }
  };

  const handleOnFilteredItemsChange = (items) => {
    if (rqStatus !== "success") {
      return;
    }
    if (items.length === 0) {
      setDeviceData(rqData.result);
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
        loading={rqStatus === "loading"}
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
