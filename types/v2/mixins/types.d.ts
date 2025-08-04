/**
 * A type which represents info about the environment where the mixin is applied.
 */
export type CallbackInfo = {
    /**
     * The name of the method where the mixin is applied.
     */
    name: string;
    /**
     * If the mixin is cancellable.
     */
    cancellable: boolean;
    /**
     * If the mixin is cancelled.
     */
    cancelled: boolean;
    /**
     * The return value of the mixin.
     */
    returnValue?: any;
    /**
     * Cancels the mixin execution.
     */
    cancel?: () => void;
    /**
     * Cancels the mixin execution and returns a value.
     * @param value The value to return.
     */
    cancelWithValue?: (value: any) => void;
};
/**
 * A type which represents a mixin that can be applied to a method.
 */
export type Mixin = {
    /**
     * The name of the method where the mixin is applied.
     */
    method: string;
    /**
     * The location where the mixin is applied.
     *
     * * `HEAD` - The mixin is applied at the start of the method.
     * * `TAIL` - The mixin is applied at the end of the method (before the final return call in the main scope of the method, if any).
     * * `INSERT` - The mixin is applied at a specific location in the method. The `target` property specifies the token to insert the mixin after.
     * If the `ordinal` property is specified, the mixin will be applied after the nth occurrence of the target token.
     * If the `ordinal` property is not specified, the mixin will be applied after every occurrence of the target token.
     */
    at:
        | "HEAD"
        | "TAIL"
        | {
              name: "INSERT";
              target: string;
              ordinal?: number;
          };
    /**
     * If the mixin is cancellable.
     * Defaults to false.
     */
    cancellable?: boolean;
    /**
     * The code to be executed as the mixin.
     *
     * @param ctx The context of the mixin. This is equivalent to `this` in the method. Make sure the name of this parameter does not conflict with any locales in the target method.
     * @param info The info about the environment where the mixin is applied. Make sure the name of this parameter does not conflict with any locales in the target method.
     * @param locales The locales of the target method which are accessed by the mixin.
     */
    callback?(ctx: any, info: CallbackInfo, ...locales: any[]): void;
    /**
     * The code to be executed as the mixin.
     * This is an alternative to the `callback` property, which allows you to specify the mixin code directly as a string.
     *
     * **NOTE**: No `info` or `ctx` are generated for this code, so you must handle the context and info manually.
     */
    code?: string;
};
export type GlobalMixin = {
    /**
     * The target token where the mixin is applied. (Similar to the `INSERT` mixin)
     */
    target: string;
    /**
     * The ordinal of the target token where the mixin is applied.
     * If not specified, the mixin will be applied after every occurrence of the target token
     */
    ordinal?: number;
    /**
     * The code to be executed as the mixin.
     * @param ctx The context of the mixin. This is equivalent to `this` in the method. Make sure the name of this parameter does not conflict with any locales in the insertion points.
     * @param locales The locales of the target method which are accessed by the mixin.
     */
    callback?(ctx: any, ...locales: any[]): void;
    /**
     * The code to be executed as the mixin.
     * This is an alternative to the `callback` property, which allows you to specify the mixin code directly as a string.
     *
     * **NOTE**: No `ctx` is generated for this code, so you must handle the context and info manually.
     */
    code?: string;
};
