import React, { useEffect } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import { getOnLoadActions, getUserActions } from "@kagami/core";
import "./Content.less";


const mapDispatchToProps = {
  getUser: getUserActions.request,
  getOnLoad: getOnLoadActions.request
}

type Props = typeof mapDispatchToProps;

const Content = ({ getOnLoad, getUser }: Props) => {
  useEffect(() => {
    getUser({});
    getOnLoad({});
  }, [getOnLoad, getUser])

  return (
    <Layout.Content className="main_content" id="fullscreen_target">
      {/* <SpitPane /> */}
    </Layout.Content>
  );
};

export default connect(null, mapDispatchToProps)(Content);
