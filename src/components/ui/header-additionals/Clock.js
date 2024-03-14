import React, { Fragment, useReducer } from 'react'
import cn from 'classnames'
import styles from '../../../css/header-additionals.module.css'
import moment from 'moment'

const Clock = () => {
    const clockFormat = "dddd, D MMM YYYY HH:mm:ss"
    const initialClockText = moment().format(clockFormat)
    const [clockText, runClock] = useReducer(() => moment().format(clockFormat));
    setInterval(runClock, 1000)
    return(
        <Fragment>
            <p className={cn(styles["p--adjustment"])}>
                {!clockText && initialClockText}
                {clockText}
            </p>
        </Fragment>
    )
}

export default Clock