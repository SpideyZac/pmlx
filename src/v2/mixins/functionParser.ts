/**
 * Utility functions for parsing function metadata.
 */
export class FunctionParser {
    /**
     * Parses the parameters of a function and returns them as an array of strings.
     * @param fn The function to parse.
     * @returns An array of parameter names.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    static parseParams(fn: Function): string[] {
        const code = fn.toString();
        const params = code.slice(code.indexOf("(") + 1, code.indexOf(")"));
        return params.split(",").map((param) => param.trim());
    }

    /**
     * Parses the body of a function and returns it as a string.
     * @param fn The function to parse.
     * @returns The body of the function as a string.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    static parseBody(fn: Function): string {
        const code = fn.toString();
        return code.slice(code.indexOf("{") + 1, code.lastIndexOf("}"));
    }
}
