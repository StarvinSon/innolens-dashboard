import {
  createStore as createReduxStore, Store as ReduxStore, combineReducers
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import {
  DependencyRegistrant, DependencyCreator, createToken,
  createSingletonDependencyRegistrant
} from '../context';

import { Reducer, AnyAction } from './types';
import { MemberGroupsState, reduceMemberGroupsState, registerMemberGroupsActions } from './member-groups';
import { OAuth2State, reduceOAuth2TokenState, registerOAuth2Actions } from './oauth2';
import { PathState, reducePathState, registerPathActions } from './path';


export { AnyAction };


export interface State {
  readonly path: PathState;
  readonly oauth2Token: OAuth2State;
  readonly memberGroups: MemberGroupsState;
}


const reduce: Reducer<State> = combineReducers({
  path: reducePathState,
  oauth2Token: reduceOAuth2TokenState,
  memberGroups: reduceMemberGroupsState
});


export interface Store extends ReduxStore<State, AnyAction> {}

export const Store = createToken<Store>(module.id, 'Store');

export const createStore: DependencyCreator<Store> = () => createReduxStore(
  reduce,
  undefined,
  composeWithDevTools()
);

export const registerStore = createSingletonDependencyRegistrant(Store, createStore);


export const registerActions: DependencyRegistrant<[() => State]> = (ctx, getState) => {
  registerMemberGroupsActions(ctx, () => getState().memberGroups);
  registerOAuth2Actions(ctx, () => getState().oauth2Token);
  registerPathActions(ctx, () => getState().path);
};
