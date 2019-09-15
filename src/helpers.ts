import { Immutable } from "immer";
import { Reducer } from "redux";

/** cast the value as immutable. */
export const immutable = <T>(value: T): Immutable<T> => value as Immutable<T>;

/** get the state type of a reducer. */
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer State, any>
  ? State
  : never;
