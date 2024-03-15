import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import cn from "classnames";
import styles from "../../../css/header-additionals.module.css";

const CompanyName = () => {
  const loginData = useSelector((state) => state.auth.data);
  const { company, subs } = loginData;
  return (
    <Fragment>
      <p className={cn(styles["p--adjustment"])}>
        {company}
        <span
          className={cn(
            styles["p--adjustment__subplan-space"],
            styles["p--adjustment__subplan-font--blue"]
          )}
        >
          ({subs.plan_name})
        </span>
      </p>
    </Fragment>
  );
};

export default CompanyName;
