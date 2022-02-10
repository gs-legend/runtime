import { apiCallIds, forgottenPasswordAction, useTrackProgress } from '@kagami/core';
import React from 'react';
import { connect } from 'react-redux';
import ForgottenPasswordForm from './view';


const mapDispatchToProps = {
  forgottenPassword: forgottenPasswordAction,
};

type Props = typeof mapDispatchToProps;

const ForgottenPasswordContainer = ({ forgottenPassword }: Props) => {
  const isInProgress = useTrackProgress(apiCallIds.FORGOTTEN_PASSWORD);

  return <ForgottenPasswordForm isLoading={isInProgress} onSubmit={forgottenPassword} />;
};

export default connect(null, mapDispatchToProps)(ForgottenPasswordContainer);
