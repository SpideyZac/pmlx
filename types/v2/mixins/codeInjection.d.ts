import { CallbackInfo } from "./types";
/**
 * Utility functions for parsing function metadata.
 */
export declare namespace FunctionParser {
    /**
     * Parses the parameters of a function and returns them as an array of strings.
     * @param fn The function to parse.
     * @returns An array of parameter names.
     */
    function parseParams(fn: Function): string[];
    /**
     * Parses the body of a function and returns it as a string.
     * @param fn The function to parse.
     * @returns The body of the function as a string.
     */
    function parseBody(fn: Function): string;
}
/**
 * Utility class for code injection operations.
 */
export declare namespace CodeInjector {
    /**
     * Finds all indices where a target token appears in the code.
     * @param code The code to search in.
     * @param target The target token to find.
     * @returns An array of indices where the target token ends.
     */
    function findTargetIndices(code: string, target: string): number[];
    /**
     * Injects content at specific indices in the code.
     * @param code The original code.
     * @param content The content to inject.
     * @param targetIndices The indices where to inject the content.
     * @param ordinal If specified, only inject at the nth occurrence.
     * @returns The modified code.
     */
    function injectAtIndices(
        code: string,
        content: string,
        targetIndices: number[],
        ordinal?: number
    ): string;
    /**
     * Finds the last return statement in the main scope of a method.
     * @param code The method body code.
     * @returns The index of the last return statement, or -1 if not found in main scope.
     */
    function findLastMainScopeReturn(code: string): number;
}
/**
 * Utility class for generating callback content.
 */
export declare namespace CallbackGenerator {
    /**
     * Generates the content of a mixin callback function.
     * @param callback The callback function to be executed as a mixin.
     * @param ctxParam The name of the context parameter in the callback.
     * @param infoParam The name of the info parameter in the callback.
     * @param info The info about the environment where the mixin is applied.
     * @returns The generated callback content.
     */
    function generateCallbackContent(
        callback: Function,
        ctxParam: string,
        infoParam: string,
        info: CallbackInfo
    ): string;
    /**
     * Generates content for a global mixin callback.
     * @param callback The callback function.
     * @param ctxParam The name of the context parameter.
     * @returns The generated content.
     */
    function generateGlobalCallbackContent(
        callback: Function,
        ctxParam: string
    ): string;
}
