import { action } from "./action";

describe(action.name, () => {
  const createMyAction = action("myAction");

  const createMetaAction = createMyAction.meta<string>();

  it("creates a named action if a tag is provided", () => {
    const myAction = createMyAction();
    expect(myAction).toEqual({ type: "myAction", meta: undefined, payload: undefined });
  });

  it("can rename the action using as()", () => {
    const renamed = createMyAction.as("myOtherAction");
    expect(renamed()).toEqual({
      type: "myOtherAction",
      payload: undefined,
      meta: undefined
    });
  });

  describe("action()", () => {
    const createUnnamed = action();

    it("creates an unnamed action if no tag is provided", () => {
      expect(createUnnamed()).toEqual({ type: "", meta: undefined, payload: undefined });
    });

    it("can rename the action using as()", () => {
      const named = createUnnamed.as("named");
      expect(named()).toEqual({
        type: "named",
        meta: undefined,
        payload: undefined
      });
    });
  });

  describe("action('tag').payload<P>()", () => {
    const create = createMyAction.payload<string>();

    it("creates an action with payload", () => {
      expect(create("test")).toEqual({ type: "myAction", meta: undefined, payload: "test" });
    });

    it("can rename the action using as()", () => {
      const renamed = create.as("myOtherAction");
      expect(renamed("test-payload")).toEqual({
        type: "myOtherAction",
        payload: "test-payload",
        meta: undefined
      });
    });
  });

  describe("action('tag').payload<IP, P>(ip => p)", () => {
    const create = createMyAction.payload((n: number) => n.toFixed(2));

    it("creates an action with payload", () => {
      expect(create(3)).toEqual({ type: "myAction", meta: undefined, payload: "3.00" });
    });

    it("can rename the action using as()", () => {
      const renamed = create.as("myOtherAction");
      expect(renamed(4)).toEqual({
        type: "myOtherAction",
        payload: "4.00",
        meta: undefined
      });
    });
  });

  describe("action('tag').meta<M>()", () => {
    it("creates an action with meta information", () => {
      expect(createMetaAction("test-meta")).toEqual({
        type: "myAction",
        meta: "test-meta",
        payload: undefined
      });
    });

    it("can rename the action using as()", () => {
      const renamed = createMetaAction.as("myOtherAction");
      expect(renamed("test-meta")).toEqual({
        type: "myOtherAction",
        meta: "test-meta",
        payload: undefined
      });
    });
  });

  describe("action('tag').meta<IM, M>(im => m)", () => {
    const create = createMyAction.meta((n: number) => n.toFixed(2));

    it("creates an action with meta information", () => {
      expect(create(2)).toEqual({
        type: "myAction",
        meta: "2.00",
        payload: undefined
      });
    });

    it("can rename the action using as()", () => {
      const renamed = create.as("myOtherAction");
      expect(renamed(3)).toEqual({
        type: "myOtherAction",
        meta: "3.00",
        payload: undefined
      });
    });
  });

  describe("action('tag').meta<M>().payload<P>()", () => {
    const create = createMetaAction.payload<number>();

    it("creates an action with meta and payload", () => {
      expect(create("test-meta", 42)).toEqual({ type: "myAction", meta: "test-meta", payload: 42 });
    });

    it("can rename the action using as()", () => {
      const renamed = create.as("myOtherAction");
      expect(renamed("test-meta", 42)).toEqual({
        type: "myOtherAction",
        meta: "test-meta",
        payload: 42
      });
    });
  });

  describe("action('tag').meta<IM, M>(im => m).payload<IP, P>(ip => p)", () => {
    const create = createMyAction
      .meta((n: number) => n.toFixed(2))
      .payload((s: string) => parseInt(s));

    it("creates an action with meta and payload", () => {
      expect(create(2, "100")).toEqual({ type: "myAction", meta: "2.00", payload: 100 });
    });

    it("can rename the action using as()", () => {
      const renamed = create.as("myOtherAction");
      expect(renamed(2, "100")).toEqual({
        type: "myOtherAction",
        meta: "2.00",
        payload: 100
      });
    });
  });
});
