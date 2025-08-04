import { Mixin, GlobalMixin } from "./types";

/**
 * Utility class for managing mixins and global mixins.
 */
export class MixinStorage {
    private static mixins: Mixin[] = [];
    private static globalMixins: GlobalMixin[] = [];

    /**
     * Adds a mixin to the storage.
     * @param mixin The mixin to add.
     */
    static addMixin(mixin: Mixin): void {
        this.mixins.push(mixin);
    }

    /**
     * Retrieves all mixins stored in the storage.
     * @returns An array of mixins.
     */
    static getMixins(): Mixin[] {
        return this.mixins;
    }

    /**
     * Adds a global mixin to the storage.
     * @param mixin The global mixin to add.
     */
    static addGlobalMixin(mixin: GlobalMixin): void {
        this.globalMixins.push(mixin);
    }

    /**
     * Retrieves all global mixins stored in the storage.
     * @returns An array of global mixins.
     */
    static getGlobalMixins(): GlobalMixin[] {
        return this.globalMixins;
    }
}
