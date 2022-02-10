import { apiCallIds, loginActions, useTrackProgress } from '@kagami/core';
import React from 'react';
import { connect } from 'react-redux';

import Login from './view';

const mapDispatchToProps = {
  login: loginActions.request
};

type Props = typeof mapDispatchToProps;


const LoginContainer = ({ login }: Props) => {
  const isInProgress = useTrackProgress(apiCallIds.LOGIN);
  return <Login isLoading={isInProgress} onSubmit={login} />;
};

export default connect(null, mapDispatchToProps)(LoginContainer);
