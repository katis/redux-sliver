import { CreateAction, ActionFromMeta, ActionFromPayload, ActionFromMetaPayload } from "./action";

export type AnyActionCreator =
  | CreateAction<string>
  | ActionFromMeta<string, any, any>
  | ActionFromPayload<string, any, any>
  | ActionFromMetaPayload<string, any, any>;

export type AnyCreateActions = { [key: string]: AnyActionCreator };

/** Replaces the action creators tag type. */
export type AsAction<NewTag extends string, A extends AnyActionCreator> = A extends CreateAction<
  string
>
  ? CreateAction<NewTag>
  : A extends ActionFromMeta<string, infer IM, infer M>
  ? ActionFromMeta<NewTag, IM, M>
  : A extends ActionFromPayload<string, infer IP, infer P>
  ? ActionFromPayload<NewTag, IP, P>
  : A extends ActionFromMetaPayload<string, infer IM, infer IP, infer M, infer P>
  ? ActionFromMetaPayload<NewTag, IM, IP, M, P>
  : never;

/** returns the a map of action creators, with the tags changed to the map keys. */
export function actionsFrom<Creates extends AnyCreateActions>(
  creates: Creates
): { [P in Extract<keyof Creates, string>]: AsAction<P, Creates[P]> } {
  const result: Record<string, AnyActionCreator> = {};
  for (const key of Object.keys(creates)) {
    const as = creates[key].as as (s: string) => AnyActionCreator;
    result[key] = as(key);
  }
  return result as { [P in Extract<keyof Creates, string>]: AsAction<P, Creates[P]> };
}
