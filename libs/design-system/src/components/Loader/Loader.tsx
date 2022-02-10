import React from "react";
import Styles from "./Loader.module.less";

export const Loader = () => {
  return (
    <>
      <div className={Styles.loader_container}> </div>
      <div className={Styles.loader_content}>
        <div className={Styles.loader}>
          <div className={Styles.container}>
            <i className={Styles.layer}></i>
            <i className={Styles.layer}></i>
            <i className={Styles.layer}></i>
          </div>
          <div className={Styles.bounce}></div>
        </div>
      </div>
    </>
  );
};