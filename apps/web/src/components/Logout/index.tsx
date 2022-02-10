import { logoutAction } from "@kagami/core";
import { useEffect } from "react";
import { connect } from "react-redux";

const mapDispatchToProps = {
  logout: logoutAction,
};

type Props = typeof mapDispatchToProps;

const LogoutContainer = ({ logout }: Props) => {
  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default connect(null, mapDispatchToProps)(LogoutContainer);
