import { ReactNode } from 'react';
import { Layout } from 'antd';

import './Header.less';
import { Link } from 'react-router-dom';
import { rootPath } from '@kagami/core';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

type Props = {
  collapsed: boolean;
  onCollapse: Function;
  logo: any;
  defaultLogo: any,
  children: ReactNode;
};


const Header = ({ collapsed, onCollapse, logo, defaultLogo, children }: Props) => {
  const menuIcon = () => {
    const collapsedIcon = <MenuUnfoldOutlined onClick={() => onCollapse()} />;
    const expandedIcon = <MenuFoldOutlined onClick={() => onCollapse()} />;
    return collapsed ? collapsedIcon : expandedIcon;
  }
  return (
    <Layout.Header>
      <div className="layout_header">
        <div className="header_block">
          {menuIcon()}
          <Link to={rootPath} className="logo">
            <img alt="logo" className="standard_logo" title="Powered by KagamiERP" src={logo || defaultLogo} />
          </Link>
        </div>
        {children}
      </div>
    </Layout.Header >
  );
};

export default Header;