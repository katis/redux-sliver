import producer, { Immutable, Draft } from "immer";
import { Action } from "./action";
import { AnyCreateActions } from "./actionsFrom";

export type FieldReducer<State, Action> = (state: Draft<State>, action: Action) => void | State;

export type Reducer<State> = (state: Immutable<State> | undefined, action: Action<string>) => State;

export type FieldReducers<State, Actions extends AnyCreateActions> = {
  readonly [P in keyof Actions]: FieldReducer<State, ReturnType<Actions[P]>>;
};

export type ReducerFrom<State, Actions extends AnyCreateActions> = (
  reducers: FieldReducers<State, Actions>
) => Reducer<State>;

/** create a reducer function from an initialState and reducers matching the provided actions */
export const reducerFrom = <State, Actions extends AnyCreateActions>(
  initialState: Immutable<State>,
  _actions: Actions
): ReducerFrom<State, Actions> => reducers =>
  producer((state: Draft<State>, action: Action<string>) => {
    const reducer = reducers[action.type];
    return reducer ? reducer(state, action as any) : state;
  }, initialState) as any;
