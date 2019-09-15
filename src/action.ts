export type Action<Tag extends string, Payload = unknown, Meta = unknown> = {
  type: Tag;
  meta: Meta;
  payload: Payload;
};

export type CreateAction<Tag extends string> = {
  (): Action<Tag>;

  /** returns an action creator that takes a payload argument. */
  payload<Payload>(): ActionFromPayload<Tag, Payload>;

  /** returns an action creator that takes a transformed payload argument. */
  payload<InPayload, P>(map: (input: InPayload) => P): ActionFromPayload<Tag, InPayload, P>;

  /** returns an action creator that takes a meta information argument. */
  meta<Meta>(): ActionFromMeta<Tag, Meta>;

  /** returns an action creator that takes a transformed meta information argument. */
  meta<InMeta, Meta>(map: (input: InMeta) => Meta): ActionFromMeta<Tag, InMeta, Meta>;

  /** returns an action creator with the tag changed */
  as<NewTag extends string>(newTag: NewTag): CreateAction<NewTag>;
};

/** Creates an unnamed action creator. Useful with actionsFrom as it renames the actions based on keys. */
export function action(): CreateAction<"">;
/** Creates an action creator with the provided tag. Has no payload or meta information. */
export function action<Tag extends string>(tag: Tag): CreateAction<Tag>;
export function action<Tag extends string>(tag: Tag = "" as Tag): CreateAction<Tag> {
  function plainAction(): Action<Tag> {
    return { type: tag, meta: undefined, payload: undefined };
  }

  plainAction.meta = <IM, M>(mapMeta?: (input: IM) => M) => actionFromMeta(tag, mapMeta);
  plainAction.payload = <IP, P>(mapPayload?: (input: IP) => P) =>
    actionFromPayload(tag, mapPayload);

  plainAction.as = <NewTag extends string>(newTag: NewTag) => action(newTag);

  return plainAction;
}

export type ActionFromMeta<Tag extends string, InMeta, Meta = InMeta> = {
  /** creates a new action with the given meta information. */
  (meta: InMeta): Action<Tag, unknown, Meta>;

  /** returns an action creator that takes a payload argument. */
  payload<Payload>(): ActionFromMetaPayload<Tag, InMeta, Payload, Meta>;

  /** returns an action creator that takes a payload argument which is transformed. */
  payload<InPayload, Payload>(
    map: (input: InPayload) => Payload
  ): ActionFromMetaPayload<Tag, InMeta, InPayload, Meta, Payload>;

  /** returns an action creator with the tag changed */
  as<NewTag extends string>(newTag: NewTag): ActionFromMeta<NewTag, InMeta, Meta>;
};

function actionFromMeta<Tag extends string, InMeta, Meta>(
  tag: Tag,
  map?: (value: InMeta) => Meta
): ActionFromMeta<Tag, InMeta, Meta> {
  function meta(input: InMeta): Action<Tag, unknown, Meta> {
    return {
      type: tag,
      meta: (map ? map(input) : input) as Meta,
      payload: undefined
    };
  }

  meta.payload = <InPayload, Payload>(mapPayload?: (value: InPayload) => Payload) =>
    actionFromMetaPayload(tag, map, mapPayload);

  meta.as = <NewTag extends string>(newTag: NewTag) => actionFromMeta(newTag, map);

  return meta;
}

export type ActionFromPayload<Tag extends string, InPayload, Payload = InPayload> = {
  /** returns a new action with the given payload. */
  (input: InPayload): Action<Tag, Payload>;

  /** returns an action creator with the tag changed */
  as<NewTag extends string>(newTag: NewTag): ActionFromPayload<NewTag, InPayload, Payload>;
};

function actionFromPayload<Tag extends string, I, P>(
  tag: Tag,
  mapPayload?: (value: I) => P
): ActionFromPayload<Tag, I, P> {
  function payload(input: I) {
    return {
      type: tag,
      meta: undefined,
      payload: (mapPayload ? mapPayload(input) : input) as P
    };
  }

  payload.as = <NewTag extends string>(newTag: NewTag) => actionFromPayload(newTag, mapPayload);

  return payload;
}

export type ActionFromMetaPayload<
  Tag extends string,
  InMeta,
  InPayload,
  Meta = InMeta,
  P = InPayload
> = {
  /** returns an action with both meta and payload. */
  (meta: InMeta, payload: InPayload): Action<Tag, P, Meta>;

  /** returns an action creator with the tag changed */
  as<NewTag extends string>(
    newTag: NewTag
  ): ActionFromMetaPayload<NewTag, InMeta, InPayload, Meta, P>;
};

function actionFromMetaPayload<Tag extends string, IM, M, IP, P>(
  tag: Tag,
  mapMeta?: (value: IM) => M,
  mapPayload?: (value: IP) => P
): ActionFromMetaPayload<Tag, IM, IP, M, P> {
  function metaWithPayload(meta: IM, payload: IP) {
    return {
      type: tag,
      meta: (mapMeta ? mapMeta(meta) : meta) as M,
      payload: (mapPayload ? mapPayload(payload) : payload) as P
    };
  }

  metaWithPayload.as = <NewTag extends string>(newTag: NewTag) =>
    actionFromMetaPayload(newTag, mapMeta, mapPayload);

  return metaWithPayload;
}
