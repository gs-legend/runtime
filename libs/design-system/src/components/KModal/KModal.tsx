import './index.less';
import React, { ReactNode, useState, useEffect } from 'react';
import { Modal } from 'antd';

type Props = {
    title: string;
    isVisible: boolean;
    children: ReactNode;
    width: number;
};

export const KModal = ({ title, isVisible, width, children }: Props) => {
    const [modalVisible, setModalVisible] = useState(isVisible);

    useEffect(() => {
        setModalVisible(isVisible);
    }, [isVisible]);

    return (
        <Modal
            title={title}
            centered
            visible={modalVisible}
            maskClosable={false}
            onOk={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            cancelButtonProps={{ hidden: true }}
            width={width}
        >
            {children}
        </Modal>
    );
}