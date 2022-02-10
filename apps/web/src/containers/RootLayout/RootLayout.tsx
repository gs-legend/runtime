import { ReactNode, useEffect, useState } from 'react';
import { Button, Dropdown, Layout, Menu } from 'antd';
import Styles from './RootLayout.module.less';
import './RootLayout.less';
import { Header, KModal, SideNav } from '@kagami/design-system';
import Content from '../../components/Content/Content';
import {
    AUTH_ROUTER_PATHS, logoutAction, RootState, selectIsLoggedIn, selectLogo, selectUser, selectDashboard,
    selectUserContext, callProcessActions, callStaticProcessActions, logoActions, GetUserResponse, generateGUID,
    createStartRequest, createLoadRequest, dataService, dmsService, API as api, DashboardResponse
} from '@kagami/core';
import { Navigate } from 'react-router';
import { connect } from 'react-redux';
import { CopyrightTwoTone, FolderFilled, InfoCircleOutlined } from '@ant-design/icons';
import { FaExternalLinkAlt } from "react-icons/fa";
import * as kagami_logo from '../../assets/images/logo.png';
import * as user_img from '../../assets/images/user.png';
import { Link } from 'react-router-dom';

import dashboardIcon from "../../assets/images/icons/dashboard.png";
import masterDataIcon from "../../assets/images/icons/masterdata.png";
import reportsIcon from "../../assets/images/icons/reports.png";
import data_migrationIcon from "../../assets/images/icons/data_migration.png";
import _ from 'lodash';
import SideNavLoadingState from '../../components/LoadingStates/SideNavLoadingState/SideNavLoadingState';

const { Footer } = Layout;
const { SubMenu } = Menu;

const mapStateToProps = (state: RootState) => {
    return {
        isLoggedIn: selectIsLoggedIn(state),
        logo: selectLogo(state),
        user: selectUser(state),
        dashboard: selectDashboard(state),
        userContext: selectUserContext(state),
    }
}

const mapDispatchToProps = {
    logout: logoutAction,
    callProcess: callProcessActions.request,
    callStaticProcess: callStaticProcessActions.request,
    setLogo: logoActions.success,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const year = new Date().getFullYear();

const AboutUs = () => {
    return (
        <>
            <div className="aboutUsContainer">
                <div className="padding15 borderBtm">
                    <img src={kagami_logo.default} width="100px" alt="Kagami" />
                </div>
                <div className="padding15 borderBtm">
                    <p className="">Kagami Runtime Version 2.0.0</p>
                </div>
                <div className="padding15">
                    <span>Get help with Kagami
                        <a href="http://kagamierp.com/" target="blank" className="pull-right">
                            <FaExternalLinkAlt />
                        </a>
                    </span>
                </div>
            </div>
            <div className="aboutUsContainer">
                <div className="padding15">
                    <p>Kagami Runtime</p>
                    <p>Copyright <CopyrightTwoTone />&nbsp;
                        {year} Kagami India pvt. ltd. All rights reserved.
                    </p>
                    <p className="marginT10">
                        Warning: This program is protected by copyright law and international treaties. Unauthorized
                        reproduction or distribution of this program, or any portions of it, may result in severe civil and
                        criminal penalties, and will be prosecuted to the maximum extent possible under the law.
                    </p>
                </div>
            </div>
        </>
    );
}

const UserOptionsMenu = (logout) => {
    return (
        <Menu>
            <Menu.Item key="logout" onClick={logout}>
                <Link to={AUTH_ROUTER_PATHS.logout}>Logout</Link>
            </Menu.Item>
        </Menu>
    )
}


const IconNode = (icon: string) => (
    <img src={icon} alt="" className="menuGroupImage" />
);


const dashboadItem = (user: string) => {
    const item = (
        <Menu.Item key="dashboard" icon={IconNode(dashboardIcon)} className="menu-item" title="Dashboard" >
            <span className="menu-item-text">Dashboard</span>
        </Menu.Item>
    )
    return user === "admin" ? item : null;
}

const adminMenuItems = (user: string) => {
    const masterData = (
        <Menu.Item key="masterData" icon={IconNode(masterDataIcon)} title="Master Data">
            <span className="menu-item-text">Master Data</span>
        </Menu.Item>
    );
    const reports = (
        <Menu.Item key="reports" icon={IconNode(reportsIcon)} title="Reports">
            <span className="menu-item-text">Reports</span>
        </Menu.Item>
    );
    const data_migration = (
        <Menu.Item key="dataMigration" icon={IconNode(data_migrationIcon)} title="Data Migration">
            <span className="menu-item-text">Data Migration</span>
        </Menu.Item>
    );

    const menuItems = [masterData, reports, data_migration];
    return user === "admin" ? menuItems : null;
};

const menuItems = (navigation: any, enableFavorites: boolean) => {
    const items = Array<ReactNode>();
    _.forEach(navigation.menuItems, (item: any, index: number) => {
        const menuItem = getItem(item, enableFavorites, index);
        items.push(menuItem);
    });
    return items;
};

const processItem = (item: any, enableFavorites: boolean, index: number) => {
    // let isFavorite = item.favourite || false;
    // let favoriteIcon = <></>;
    // if (enableFavorites) {
    //     favoriteIcon = <></>; //TODO add favorite
    // }
    return (
        <Menu.Item
            key={item.event?.process + index}
            style={{
                whiteSpace: "normal",
                height: "auto",
                lineHeight: "30px",
                margin: "10px 0px",
            }}
            className="menu-item"
            title={item.name}
        >
            <span>
                <span>{item.name}</span>
            </span>
        </Menu.Item>
    );
};

const groupItem = (item: any, enableFavorites: boolean) => {
    const submenus: any = [];
    item.subMenus.forEach((submenuItem: any, index: number) => {
        const submenu = getItem(submenuItem, enableFavorites, index);
        submenus.push(submenu);
    });
    let folderIcon = <FolderFilled />;
    if (item.img) {
        folderIcon = (
            <img
                alt={item.name}
                src={item.img}
                style={{ width: "32px", height: "32px", marginRight: "1em" }}
            />
        );
    }
    return (
        <SubMenu
            key={item.name.replace(/' '/g, "") + Math.random().toString(36).slice(2)}
            className="submenu-folder"
            icon={folderIcon}
            title={item.name}
        >
            {submenus}
        </SubMenu>
    );
};

const getItem = (item: any, enableFavorites: boolean, index: number) => {
    if (item.type === "process") {
        return processItem(item, enableFavorites, index);
    }
    if (item.type === "group") {
        return groupItem(item, enableFavorites);
    }
    return null;
};

const getOrgLogo = (
    userContext: GetUserResponse,
    process: string,
    setLogo: Function
) => {
    const localGUID = generateGUID();
    const request = createStartRequest(process);
    request.inputData.detailedObjects["UserInput"] = [
        {
            userId: userContext.userId,
            id: "temp_" + Math.random().toString(36).slice(2),
        },
    ];
    request.guid = localGUID;
    request.inputData.properties.guid = localGUID;
    api.process(request).then((response: any) => {
        const { data } = response;
        const requestOnLoad = createLoadRequest(process);
        requestOnLoad.guid = localGUID;
        requestOnLoad.inputData.properties.guid = localGUID;

        if (
            !_.isEmpty(data.constructOutputData) &&
            data.constructOutputData.uiResource &&
            data.constructOutputData.uiResource.presentations
        ) {
            const presentations = data.constructOutputData.uiResource.presentations;
            const pRuleMap = presentations.presentationRuleMap;
            const entityId = presentations.entityLevelMap[0];
            requestOnLoad.uiEvent.uiEventValue =
                pRuleMap[entityId][0].presentationId + "_onLoad";
        }
        api.process(requestOnLoad).then((processResponse: any) => {
            const resData = processResponse.data;
            if (
                resData.constructOutputData &&
                resData.constructOutputData.detailedObjects &&
                resData.constructOutputData.detailedObjects.Organization &&
                resData.constructOutputData.detailedObjects.Organization.length &&
                resData.constructOutputData.detailedObjects.Organization[0].logo
            ) {
                const requestObj = {
                    docId:
                        resData.constructOutputData.detailedObjects.Organization[0].logo.split(
                            ":"
                        )[0],
                };
                dmsService.viewDocument(requestObj).then(function (response: any) {
                    var imageUrl =
                        dataService.BASE_URL +
                        "dms/viewDocument?docId=" +
                        processResponse.constructOutputData.detailedObjects.Organization[0].logo.split(
                            ":"
                        )[0];
                    setLogo(imageUrl);
                });
            }
        });
    });
};

const RootLayout = ({ isLoggedIn, logo, user, dashboard, userContext, logout, callStaticProcess, callProcess, setLogo }: Props) => {
    const [collapsed, setCollapsed] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [enableFavorites, setenableFavorites] = useState(false);
    const [navigation, setNavigation] = useState({});

    const onCollapse = () => {
        setCollapsed(!collapsed);
    }

    const infoIcon = () => {
        const infoMenu =
            <Menu>
                <Menu.Item key="aboutus" onClick={() => { setModalVisible(!modalVisible) }}>
                    <InfoCircleOutlined />
                    About Us
                    <KModal title="About Us" isVisible={modalVisible} width={600}>
                        {AboutUs()}
                    </KModal>
                </Menu.Item>
            </Menu>;
        return (
            <div style={{ display: "inline-block" }}>
                <Dropdown overlay={infoMenu} >
                    <div className="header-icon info-icon ant-dropdown-link" onClick={e => e.preventDefault()} />
                </Dropdown>
            </div>
        );
    }

    const onMenuItemSelected = (event: any) => {
        const { key } = event;
        const staticProcesses = [
            "dashboard",
            "masterData",
            "reports",
            "dataMigration",
        ];
        if (staticProcesses.indexOf(key) > -1) {
            callStaticProcess({ processName: key });
        } else {
            const request = createStartRequest(key);
            callProcess({ request, isUserTriggered: true });
        }
    };

    useEffect(() => {
        const setDashBoardData = (dashboard: DashboardResponse) => {
            let navigation: any = {};
            let masterDataGlobal = {};
            if (dashboard && dashboard.container) {
                dashboard.container.forEach((obj) => {
                    switch (obj.panelType) {
                        case "leftPanel":
                            navigation = obj.menuPanel;
                            break;
                        case "masterDataGlobal":
                            masterDataGlobal = obj.menuPanel;
                            break;
                        case "background":
                            if (obj.menuPanel) {
                                const organizationProcess = _.find(
                                    obj.menuPanel.menuItems,
                                    function (obj: any) {
                                        return obj.name === "organization_logo";
                                    }
                                );
                                if (organizationProcess) {
                                    getOrgLogo(
                                        userContext,
                                        organizationProcess.event.process,
                                        setLogo
                                    );
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
            return { navigation, masterDataGlobal };
        };
        if (dashboard && dashboard.enableFavorites) {
            setenableFavorites(dashboard.enableFavorites);
        }
        const { navigation } = setDashBoardData(dashboard);
        setNavigation(navigation);
        callStaticProcess({ processName: "dashboard" });
    }, [dashboard, userContext, setLogo, callStaticProcess]);

    const getSideNav = () => {
        return dashboard ?
            <SideNav collapsed={collapsed} onMenuItemSelected={onMenuItemSelected} defaultKey={"dashboard"} dashboardItem={dashboadItem(user)}>
                {menuItems(navigation, enableFavorites)}
                {adminMenuItems(user)}
            </SideNav> :
            <SideNavLoadingState />
    }

    return (
        isLoggedIn ?

            <Layout className={Styles.rootLayout}
            // onContextMenu={(e) => e.preventDefault()}
            >
                <Header collapsed={collapsed} onCollapse={onCollapse} logo={logo} defaultLogo={kagami_logo.default}>
                    <div className="header-icons">
                        {infoIcon()}
                        <li className="seperator"></li>
                        <Dropdown className="content" overlay={UserOptionsMenu(logout)}>
                            <Button type="primary" shape="circle" icon={<img alt="user" className="user-image" src={user_img.default} />} >
                            </Button>
                        </Dropdown>
                    </div>
                </Header>
                <Layout.Content className="content">
                    <Layout>
                        {getSideNav()}
                        <Layout.Content>
                            <Content></Content>
                            <Footer>
                                <strong>Copyright © {year} <a href="http://kagamierp.com/" target="_blank" rel="noopener noreferrer">Kagami India Pvt. Ltd</a>.</strong>
                            </Footer>
                        </Layout.Content>
                    </Layout>
                </Layout.Content>
            </Layout> :
            <Navigate to={AUTH_ROUTER_PATHS.login} replace={true}></Navigate>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(RootLayout);
