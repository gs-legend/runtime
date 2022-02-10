import React, { useEffect } from "react";
import { Spin } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Styles from "./Progress.module.less";

NProgress.configure({ showSpinner: false });

const Progress = ({ }) => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={Styles.progress_container}>
      <Spin />
    </div>
  );
};

export default Progress;
