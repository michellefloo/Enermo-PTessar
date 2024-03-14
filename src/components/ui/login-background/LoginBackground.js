import React, {Fragment} from 'react'
import styles from '../../../css/login-background.module.css';
import enermoLoginBg from '../../../assets/images/enermo-login-background.jpg'

const LoginBackground = () => {
    return(
        <Fragment>
            <div className={styles["login-bg"]}>
                <img className={styles["login-bg__img"]} src={enermoLoginBg} alt="Enermo logo" />
            </div>
        </Fragment>
    )
}

export default LoginBackground