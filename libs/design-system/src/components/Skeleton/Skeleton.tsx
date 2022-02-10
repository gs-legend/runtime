import React from "react";
import Styles from "./Skeleton.module.less";

type Props = {};

export const Skeleton = ({ }: Props) => {
  return <div className={Styles.skeleton}>Skeleton</div>;
};