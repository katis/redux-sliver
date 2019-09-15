import { actionsFrom } from "./actionsFrom";
import { action, Action } from "./action";

describe(actionsFrom.name, () => {
  const actions = actionsFrom({
    create: action().payload<string>(),
    toggle: action().meta<number>(),
    delete: action("deleteWithMeta")
      .meta<number>()
      .payload<string>(),
    clear: action()
  });

  it("changes the action creators tag type to the key", () => {
    const _create: Action<"create"> = actions.create("");
    const _toggle: Action<"toggle"> = actions.toggle(42);
    const _deleteAction: Action<"delete"> = actions.delete(42, "");
    const _clear: Action<"clear"> = actions.clear();
  });

  it("renames the action creator's tag based on the key", () => {
    expect(actions.create("foo")).toEqual({ type: "create", payload: "foo", meta: undefined });
    expect(actions.delete(42, "foo")).toEqual({ type: "delete", payload: "foo", meta: 42 });
    expect(actions.toggle(42)).toEqual({ type: "toggle", payload: undefined, meta: 42 });
    expect(actions.clear()).toEqual({ type: "clear", payload: undefined, meta: undefined });
  });
});
