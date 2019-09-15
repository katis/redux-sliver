import { reducerFrom } from "./reducer";
import { immutable } from "./helpers";
import { action } from "./action";
import { actionsFrom } from "./actionsFrom";

describe(reducerFrom.name, () => {
  const initialState = immutable({
    users: [] as string[]
  });

  const actions = actionsFrom({
    addUser: action().payload<string>(),
    removeUser: action().payload<string>(),
    clearUsers: action()
  });

  const reducer = reducerFrom(initialState, actions)({
    addUser(state, { payload }) {
      state.users.push(payload);
    },
    removeUser: (state, { payload }) => ({ users: state.users.filter(u => u !== payload) }),
    clearUsers(state) {
      state.users.length = 0;
      return { users: [] };
    }
  });

  it("returns original state if action isn't handled by the reducer", () => {
    const unhandled = action("unhandled");
    expect(reducer(initialState, unhandled())).toBe(initialState);
  });

  it("adds users to state on addUser action", () => {
    const state = reducer(undefined, actions.addUser("Jane"));
    expect(state.users).toEqual(["Jane"]);
  });

  it("allows overriding initial state", () => {
    const state = reducer({ users: ["John"] }, actions.addUser("Jane"));
    expect(state.users).toEqual(["John", "Jane"]);
  });

  it("allows returning a new state from a field reducer", () => {
    const state = reducer({ users: ["Jane", "John"] }, actions.removeUser("Jane"));
    expect(state.users).toEqual(["John"]);
  });

  it("doesn't allow returning a new state and modifying the draft", () => {
    expect(() => reducer({ users: ["Jane", "John"] }, actions.clearUsers())).toThrowError(
      "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."
    );
  });
});
