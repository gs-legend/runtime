import { useFormRules } from '@kagami/core';
import { Button, Form, Input } from 'antd';
import React from 'react';
import AuthLayout from '../../containers/Auth/AuthLayout';

type Props = {
  isLoading: boolean;
  onSubmit: (values: any) => void;
};

const ForgottenPasswordForm = ({ isLoading, onSubmit }: Props) => {
  const { required } = useFormRules();
  return (
    <AuthLayout>
      <Form onFinish={onSubmit} layout="vertical">
        <Form.Item
          label={'E-mail'}
          name="email"
          rules={[required]}
        >
          <Input
            autoFocus
            placeholder={'E-mail'}
          />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          {'Submit'}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ForgottenPasswordForm;
