import { Mixin, GlobalMixin } from "./types";
/**
 * Utility class for managing mixins and global mixins.
 */
export declare class MixinStorage {
    private static mixins;
    private static globalMixins;
    /**
     * Adds a mixin to the storage.
     * @param mixin The mixin to add.
     */
    static addMixin(mixin: Mixin): void;
    /**
     * Retrieves all mixins stored in the storage.
     * @returns An array of mixins.
     */
    static getMixins(): Mixin[];
    /**
     * Adds a global mixin to the storage.
     * @param mixin The global mixin to add.
     */
    static addGlobalMixin(mixin: GlobalMixin): void;
    /**
     * Retrieves all global mixins stored in the storage.
     * @returns An array of global mixins.
     */
    static getGlobalMixins(): GlobalMixin[];
}
/**
 * Central registry for applying mixins to methods.
 */
export declare class MixinRegistry {
    private static headApplier;
    private static tailApplier;
    private static insertApplier;
    private static globalApplier;
    /**
     * Registers a mixin to be applied to a method.
     * @param mixin The mixin to be registered.
     */
    static registerMixin(mixin: Mixin): void;
    /**
     * Registers a global mixin to be applied across all of the code.
     * @param mixin The global mixin to be registered.
     * @param globalFn The name of the global function where the mixin is applied.
     */
    static registerGlobalMixin(mixin: GlobalMixin, globalFn: string): void;
}
