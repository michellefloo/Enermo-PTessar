export const PERSIST_KEY_NAME = "enermo"

export const HTTP_STATUS = Object.freeze({
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED',
})

export const DATE_ISO8601 = "YYYY-MM-DD HH:mm:ss"

export const DATE_ISO8601_NO_TIME = "YYYY-MM-DD"

export const MONTH_YEAR = "MYYYY"

export const MONTHNAME_YEAR = "MMMM YYYY"

export const USER_LEVELS_SELECTION = [
    { value: "1", label: "Admin" },
    { value: "4", label: "Super Admin" } 
]

export const MONTHS_ARRAY = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October","November", "December"
]

export const EXCLUDED_CHART_PARAM = {
    latdata: true,
    londata: true,
}

export const ALERT_DIFF_DAYS = 5

export const ALERT_DIFF_STATUS_MIN = 5

export const DEVICE_PARAMS_CONST = {
    'edel' : "KwH",
    // 'iavg' : "Cycle",
    "tem1" : "Temp1",
    "tem2" : "Temp2",
    "hum1" : "Hum1",
    "hum2" : "Hum2",
    "door" : "Door",
    "ptot" : "Cycle",
}

export const SENSOR_COLOR_PER_TYPE = {
    'volt' : '#0088FE',
    'curr' : '#00C49F',
    'actp' : '#FFBB28',
    'appp' : '#FF8042',
    'reap' : 'gray',
    'powf' : 'green',
    'edel' : 'maroon',
    'stat' : 'silver',
    
    'kwh' : '#0088FE',
    'current' : '#00C49F',
    'voltage' : '#FFBB28',
    'bill' : '#FF8042',
    'date' : 'gray',
    'cycle' : 'maroon',

    'iavg' : '#0088FE',
    'vavg' : '#00C49F',
    'pfac' : '#FFBB28',
    'freq' : '#FF8042',
    'stot' : 'gray',
    'qtot' : 'maroon',
    'ptot' : 'green',
    'sdtc' : 'black',

    'tem1' : '#0088FE', 
    'hum1' : '#FF8042', 
    'tem4' : '#0088FE', 
    'hum4' : '#FF8042', 
    'tem5' : '#0088FE',
    'hum5' : '#FF8042', 
    
}