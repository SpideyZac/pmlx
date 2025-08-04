import { GlobalMixin } from "./types";
import { FunctionParser } from "./functionParser";
import { CallbackGenerator } from "./callbackGenerator";
import { CodeInjector } from "./codeInjector";

/**
 * Applies global mixins across all code.
 */
export class GlobalMixinApplier {
    /**
     * Applies a global mixin to a function.
     * @param mixin The global mixin to apply.
     * @param globalFn The name of the global function.
     */
    apply(mixin: GlobalMixin, globalFn: string): void {
        const func = eval(globalFn);
        const params = FunctionParser.parseParams(func);
        let code = FunctionParser.parseBody(func);

        const content = this.generateGlobalMixinContent(mixin);
        const targetIndices = CodeInjector.findTargetIndices(
            code,
            mixin.target
        );
        code = CodeInjector.injectAtIndices(
            code,
            content,
            targetIndices,
            mixin.ordinal
        );

        eval(`${globalFn} = function(${params.join(",")}){${code}}`);
    }

    private generateGlobalMixinContent(mixin: GlobalMixin): string {
        if (mixin.code !== undefined) {
            return mixin.code;
        }

        if (!mixin.callback) {
            throw new Error(
                "Either code or callback must be provided for global mixin."
            );
        }

        const params = FunctionParser.parseParams(mixin.callback);
        const ctxParam = params[0] || "ctx";

        return CallbackGenerator.generateGlobalCallbackContent(
            mixin.callback,
            ctxParam
        );
    }
}
