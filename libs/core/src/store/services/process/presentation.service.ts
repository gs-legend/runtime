import { createAsyncAction, createReducer, ActionType } from "typesafe-actions";
import { combineReducers } from "redux";
import { DashboardResponse, RootState } from "@kagami/core";

export const getDashboardActions = createAsyncAction(
    'presentationService/GETDASHBOARD_REQUEST',
    'presentationService/GETDASHBOARD_SUCCESS',
    'presentationService/GETDASHBOARD_FAILURE'
)<{}, DashboardResponse, undefined>();

const actions = { getDashboardActions };
export type PresentationServiceAction = ActionType<typeof actions>;

type PresentationServiceState = Readonly<{
    dashboard: DashboardResponse
}>;

const initialState: PresentationServiceState = {
    dashboard: null as any
};

const dashboard = createReducer(initialState.dashboard)
    .handleAction(getDashboardActions.success, (_, { payload: dashboard }) => dashboard)
    .handleAction(getDashboardActions.failure, () => initialState.dashboard);

export const presentationServiceReducer = combineReducers({
    dashboard
});

export const selectPresentationServiceState = (state: RootState) => state.presentationService;
export const selectDashboard = (state: RootState) => selectPresentationServiceState(state).dashboard;

