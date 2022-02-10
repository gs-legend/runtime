import { AxiosResponse } from 'axios';
import { call, put, takeLatest, all } from 'redux-saga/effects';

import { getUserActions } from './role.service';
import { getDashboardActions } from './presentation.service';
import { getAppAndUserContextActions } from './kgm.cache.service';
import { getOnLoadActions } from './kgm.service';
import { selectSplitPane, selectProcessState, setCurrentPaneKeyAction, callProcessActions, callStaticProcessActions, setSplitAction, removeProcessAction } from './process.service';
import api from '../api';
import { logoutAction } from '../auth';
import _ from 'lodash';
import { AppAndUserContext, DashboardResponse, GetUserResponse, store } from '@kagami/core';



function* getUser() {
    try {
        const resp: AxiosResponse<GetUserResponse> = yield call(api.getUser);
        yield put(getUserActions.success(resp.data));
    } catch {
        yield put(getUserActions.failure());
    }
}

function* getDashboard() {
    try {
        const resp: AxiosResponse<DashboardResponse> = yield call(api.getDashboard);
        yield put(getDashboardActions.success(resp.data));
    } catch {
        yield put(getDashboardActions.failure());
    }
}

function* getAppAndUserContext() {
    try {
        const resp: AxiosResponse<AppAndUserContext> = yield call(api.getAppAndUserContext);
        yield put(getAppAndUserContextActions.success(resp.data));
    } catch {
        yield put(getAppAndUserContextActions.failure({}, {}));
    }
}

function* getOnLoadState() {
    try {
        const { appAndUserContext, dashboard } = yield all({
            appAndUserContext: call(api.getAppAndUserContext),
            dashboard: call(api.getDashboard)
        });
        yield put(getOnLoadActions.success({ appAndUserContext, dashboard }));
        if (!appAndUserContext || !dashboard) {
            yield put(logoutAction());
        }
        else {
            yield put(getAppAndUserContextActions.success(appAndUserContext.data));
            yield put(getDashboardActions.success(dashboard.data));
        }
    } catch {
        yield put(getOnLoadActions.failure());
    }
}

function* getStaticProcesss({ payload }: any) {
    try {
        const state = store.getState();
        const processes = yield selectProcessState(state);
        const { processName, callBack } = payload;
        const existing = processes[processName];
        const panes = yield selectSplitPane(state);
        const { FirstPane, SecondPane }: any = Object.assign({}, panes);

        if (existing) {
            const firstIndex = FirstPane.tabs.indexOf(processName);
            const secondIndex = SecondPane.tabs.indexOf(processName);
            let newFirstPane = { ...FirstPane };
            let newSecondPane = { ...SecondPane };
            if (secondIndex > -1) {
                newSecondPane = { ...newSecondPane, currentTab: processName };
            }
            if (firstIndex > -1) {
                newFirstPane = { ...newFirstPane, currentTab: processName };
            }
            yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane: newSecondPane }));
        }
        else {
            const newProcessState = { ...processes, [processName]: {} };
            yield put(callProcessActions.success(newProcessState));
            let newFirstPane = { ...FirstPane };
            let { tabs } = newFirstPane || [];
            tabs = [...tabs, processName];
            newFirstPane = { ...newFirstPane, tabs: tabs, currentTab: processName };
            yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane }));
            if (callBack) {
                yield put(callBack());
            }
        }
    } catch (ex) {
        console.log(ex)
    }
}

function* getProcess({ payload }: ReturnType<typeof callProcessActions.request>) {
    try {
        const processes = yield selectProcessState(store.getState());
        const { request, isUserTriggered, callBack } = payload;
        const processName = _.get(request, 'event.processName');
        const existing = processes[processName];
        const panes = yield selectSplitPane(store.getState());
        const { FirstPane, SecondPane }: any = Object.assign({}, panes);

        if (existing && isUserTriggered) {
            const firstIndex = FirstPane.tabs.indexOf(processName);
            const secondIndex = SecondPane.tabs.indexOf(processName);
            let newFirstPane = { ...FirstPane };
            let newSecondPane = { ...SecondPane };
            if (secondIndex > -1) {
                newSecondPane = { ...newSecondPane, currentTab: processName }
            }
            if (firstIndex > -1) {
                newFirstPane = { ...newFirstPane, currentTab: processName }
            }
            yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane: newSecondPane }));
        }
        else {
            const resp = yield call(api.process, request);
            if (isUserTriggered) {
                const newProcessState = { ...processes, [processName]: resp.data }
                yield put(callProcessActions.success(newProcessState));
                let newFirstPane = { ...FirstPane };
                let { tabs } = newFirstPane || [];
                tabs = [...tabs, processName];
                newFirstPane = { ...newFirstPane, tabs: tabs, currentTab: processName };
                yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane }));
            }
            else if (callBack) {
                yield put(callBack(resp));
            }
        }
    } catch {
    }
}

function* setSplitTab({ payload }: ReturnType<typeof setSplitAction.request>) {
    try {
        const { processKey, action } = payload;
        const panes = selectSplitPane(store.getState());
        const { FirstPane, SecondPane }: any = Object.assign({}, panes);
        const firstIndex = FirstPane.tabs.indexOf(processKey);
        const secondIndex = SecondPane.tabs.indexOf(processKey);
        let newFirstPane = { ...FirstPane };
        let newSecondPane = { ...SecondPane };

        if (secondIndex === -1 && action === "add") {
            newSecondPane = { ...SecondPane, tabs: [...SecondPane.tabs, processKey], currentTab: processKey };
            if (firstIndex > -1) {
                newFirstPane = {
                    ...FirstPane,
                    tabs: [...FirstPane.tabs.slice(0, firstIndex),
                    ...FirstPane.tabs.slice(firstIndex + 1)],
                    currentTab: firstIndex > 0 ? FirstPane.tabs[firstIndex - 1] : FirstPane.tabs[0]
                };
            }
        }
        if (secondIndex > -1 && action === "remove") {
            newSecondPane = {
                ...SecondPane,
                tabs: [...SecondPane.tabs.slice(0, secondIndex),
                ...SecondPane.tabs.slice(secondIndex + 1)],
                currentTab: secondIndex > 0 ? SecondPane.tabs[secondIndex - 1] : SecondPane.tabs[0]
            };
            newFirstPane = { ...FirstPane, tabs: [...FirstPane.tabs, processKey] };

        }
        yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane: newSecondPane }));
    } catch (ex) {
        console.log(ex);
    }
}

function* setCurrentPaneKey({ payload }: ReturnType<typeof setCurrentPaneKeyAction>) {
    try {
        const { processKey, paneNumber } = payload;
        const panes = selectSplitPane(store.getState());
        const { FirstPane, SecondPane } = panes;
        let newFirstPane = { ...FirstPane };
        let newSecondPane = { ...SecondPane };
        if (paneNumber === 1) {
            newFirstPane = { ...FirstPane, currentTab: processKey };
        }
        if (paneNumber === 2) {
            newSecondPane = { ...SecondPane, currentTab: processKey };
        }

        yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane: newSecondPane }));
    } catch (ex) {
        console.log(ex);
    }
}

function* removeProcess({ payload }: ReturnType<typeof removeProcessAction>) {
    try {
        const { processKey } = payload;

        const panes = selectSplitPane(store.getState());
        const processes = yield selectProcessState(store.getState());

        const { FirstPane, SecondPane } = panes;
        const firstIndex = FirstPane.tabs.indexOf(processKey);
        const secondIndex = SecondPane.tabs.indexOf(processKey);
        let newFirstPane = { ...FirstPane };
        let newSecondPane = { ...SecondPane };

        const { [processKey]: remove, ...rest } = processes;
        yield put(callProcessActions.success(rest));

        if (firstIndex !== -1) {
            newFirstPane = {
                ...FirstPane,
                tabs: [...FirstPane.tabs.slice(0, firstIndex),
                ...FirstPane.tabs.slice(firstIndex + 1)],
                currentTab: FirstPane.currentTab === processes ? FirstPane.tabs[0] : FirstPane.currentTab
            };
        }

        if (secondIndex !== -1) {
            newSecondPane = {
                ...SecondPane,
                tabs: [...SecondPane.tabs.slice(0, secondIndex),
                ...SecondPane.tabs.slice(secondIndex + 1)],
                currentTab: SecondPane.currentTab === processes ? SecondPane.tabs[0] : SecondPane.currentTab
            };
        }

        yield put(setSplitAction.success({ FirstPane: newFirstPane, SecondPane: newSecondPane }));
    } catch (ex) {
        console.log(ex);
    }
}

export function* kgmSaga() {
    yield takeLatest(getUserActions.request, getUser);
    yield takeLatest(getDashboardActions.request, getDashboard);
    yield takeLatest(getAppAndUserContextActions.request, getAppAndUserContext);
    yield takeLatest(getOnLoadActions.request, getOnLoadState);
    yield takeLatest(callProcessActions.request, getProcess);
    yield takeLatest(callStaticProcessActions.request, getStaticProcesss);
    yield takeLatest(setSplitAction.request, setSplitTab);
    yield takeLatest(setCurrentPaneKeyAction, setCurrentPaneKey);
    yield takeLatest(removeProcessAction, removeProcess);
}