import { escapeRegExp } from "./utils";
import { CallbackInfo } from "./types";
import { FunctionParser } from "./functionParser";

/**
 * Utility class for generating callback content.
 */
export class CallbackGenerator {
    /**
     * Generates the content of a mixin callback function.
     * @param callback The callback function to be executed as a mixin.
     * @param ctxParam The name of the context parameter in the callback.
     * @param infoParam The name of the info parameter in the callback.
     * @param info The info about the environment where the mixin is applied.
     * @returns The generated callback content.
     */
    static generateCallbackContent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        callback: Function,
        ctxParam: string,
        infoParam: string,
        info: CallbackInfo
    ): string {
        let content = `var ${infoParam} = ${JSON.stringify(info)};`;

        if (info.cancellable) {
            content += `${infoParam}.cancel = () => { ${infoParam}.cancelled = true; };`;
            content += `${infoParam}.cancelWithValue = (value) => { ${infoParam}.cancelled = true; ${infoParam}.returnValue = value; };`;
        }

        const ctxRegex = new RegExp(`\\b${escapeRegExp(ctxParam)}\\b`, "g");
        content += FunctionParser.parseBody(callback).replace(ctxRegex, "this");

        if (info.cancellable) {
            content += `if (${infoParam}.cancelled) return ${infoParam}.returnValue;`;
        }

        return content;
    }

    /**
     * Generates content for a global mixin callback.
     * @param callback The callback function.
     * @param ctxParam The name of the context parameter.
     * @returns The generated content.
     */
    static generateGlobalCallbackContent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        callback: Function,
        ctxParam: string
    ): string {
        return FunctionParser.parseBody(callback).replace(
            new RegExp(`\\b${escapeRegExp(ctxParam)}\\b`, "g"),
            "this"
        );
    }
}
