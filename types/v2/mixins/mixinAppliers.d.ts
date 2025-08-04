import { Mixin, GlobalMixin } from "./types";
/**
 * Base class for mixin appliers with common functionality.
 */
declare abstract class BaseMixinApplier {
    /**
     * Applies a mixin to a method.
     * @param mixin The mixin to apply.
     */
    abstract apply(mixin: Mixin): void;
    /**
     * Generates the content for a mixin.
     * @param mixin The mixin to generate content for.
     * @throws Error if neither code nor callback is provided.
     * @returns The generated content.
     */
    protected generateMixinContent(mixin: Mixin): string;
    /**
     * Reconstructs a function with the given method name, parameters, and body.
     * @param method The name of the method to reconstruct.
     * @param params The parameters of the method.
     * @param body The body of the method.
     */
    protected reconstructFunction(
        method: string,
        params: string[],
        body: string
    ): void;
}
/**
 * Applies mixins to the head of methods.
 */
export declare class HeadMixinApplier extends BaseMixinApplier {
    apply(mixin: Mixin): void;
}
/**
 * Applies mixins to the tail of methods.
 */
export declare class TailMixinApplier extends BaseMixinApplier {
    apply(mixin: Mixin): void;
}
/**
 * Applies mixins at specific insertion points in methods.
 */
export declare class InsertMixinApplier extends BaseMixinApplier {
    apply(mixin: Mixin): void;
}
/**
 * Applies global mixins across all code.
 */
export declare class GlobalMixinApplier {
    /**
     * Applies a global mixin to a function.
     * @param mixin The global mixin to apply.
     * @param globalFn The name of the global function.
     */
    apply(mixin: GlobalMixin, globalFn: string): void;
    private generateGlobalMixinContent;
}
export {};
