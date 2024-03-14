export const  addCDatatableRowClasses = async (item, style) => {
    item._classes = style
}

export const removeLastCDatatableRowClasses = async (item) => {
    item._classes = null
}

export const downloadCsv = (csv, fileName) => {
    const blob = new Blob([csv]);
    fileName = `${fileName}-${+new Date()}.csv`;
    if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
        window.navigator.msSaveBlob(blob, fileName);
    else
    {
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        a.download = fileName;
        document.body.appendChild(a);
        a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(a);
    }
}

export const getSensorInChartNaming = (sensorParam) => {
    switch(sensorParam){
        case "iavg" : return "Avg. Current"
        case "vavg" : return "Voltage"
        case "edel" : return "Energy Deliver"
        case "freq" : return "Fequency"
        case "pfac" : return "Power Factor"
        case "stot" : return "Apparent Power" 
        case "ptot" : return "Active Power"
        case "qtot" : return "Reactive Power" 
        case "sdtc" : return "Data Checker" 
        case "Current_Avg" : return "Current Avg"
        case "Voltage_LL_Avg" : return "Voltage LL Avg"
        case "Voltage_LN_Avg" : return "Voltage_LN_Avg"
        case "Active_Power_Total" : return "Active_Power_Total"
        case "Reactive_Power_Total" : return "Reactive_Power_Total"
        case "Apparent_Power_Total" : return "Apparent_Power_Total"
        case "Power_Factor_Total" : return "Power_Factor_Total"
        case "Frequency" : return "Frequency"
        case "Active_Energy_Delivered" : return "Active_Energy_Delivered"
        case "Reactive_Energy_Delivered" : return "Reactive Energy Delivered"
        case "Apparent_Energy_Delivered" : return "Apparent Energy Delivered"
        case "Max_Current_Unbalance_Worst" : return "Max Current Unbalance Worst"
        case "Max_Voltage_Unbalance_LL_Worst" : return "Max Voltage Unbalance LL Worst"
        case "Max_Voltage_Unbalance_LN_Worst" : return "Max Voltage Unbalance LN Worst"
        case "tem1" : return "Temperature 1" 
        case "tem2" : return "Temperature 2" 
        case "tem3" : return "Temperature 3" 
        case "hum1" : return "Humidity 1" 
        case "hum2" : return "Humidity 2" 
        case "hum3" : return "Humidity 3" 
        case "door" : return "Door"
        default : return sensorParam
    }
}

export const countSensorProduct= (sensors) => {
    let countResult = {
        kwh: 0,
        cycle: 0,
        temperature: 0,
        humidity: 0,
        door: 0,
    }
    sensors.forEach(s => {
        switch(s.sensor_type_parameter){
            case "edel" : countResult.kwh += 1; break;
            // case "sdtc" : countResult.cycle += 1; break;
            // case "tem1" : countResult.temperature += 1; break;
            // case "tem2" : countResult.temperature += 1; break;
            // case "tem3" : countResult.temperature += 1; break;
            // case "hum1" : countResult.humidity += 1; break;
            // case "hum2" : countResult.humidity += 1; break;
            // case "hum3" : countResult.humidity += 1; break;
            // case "door" : countResult.door += 1; break;
            default : break;
        }
    })
    return countResult
}
