import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { ReactNode } from "react";
import "./SideNav.less";

type Props = {
  collapsed: boolean,
  onMenuItemSelected: Function,
  defaultKey: string,
  dashboardItem: ReactNode,
  children: ReactNode,
}
export const SideNav = ({ collapsed, onMenuItemSelected, defaultKey, dashboardItem, children }: Props) => {
  return (
    <Sider
      breakpoint="lg"
      collapsed={collapsed}
      className="kgm-sidenav"
      width={230}
      theme="dark"
    >
      <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={[defaultKey]}
        onClick={(e: any) => onMenuItemSelected(e)}
      >
        {dashboardItem}
        {children}
      </Menu>
    </Sider>
  );
};
