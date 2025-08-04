import { escapeRegExp } from "./utils";

/**
 * Utility class for code injection operations.
 */
export class CodeInjector {
    /**
     * Finds all indices where a target token appears in the code.
     * @param code The code to search in.
     * @param target The target token to find.
     * @returns An array of indices where the target token ends.
     */
    static findTargetIndices(code: string, target: string): number[] {
        const targetRegex = new RegExp(`${escapeRegExp(target)}`, "g");
        const targetIndices: number[] = [];
        let match;
        while ((match = targetRegex.exec(code)) !== null) {
            targetIndices.push(match.index + match[0].length);
        }
        return targetIndices;
    }

    /**
     * Injects content at specific indices in the code.
     * @param code The original code.
     * @param content The content to inject.
     * @param targetIndices The indices where to inject the content.
     * @param ordinal If specified, only inject at the nth occurrence.
     * @returns The modified code.
     */
    static injectAtIndices(
        code: string,
        content: string,
        targetIndices: number[],
        ordinal?: number
    ): string {
        if (ordinal !== undefined) {
            if (ordinal < 0) {
                throw new Error("Ordinal must be a non-negative integer.");
            }

            const targetIndex = targetIndices[ordinal];
            if (targetIndex !== undefined) {
                return (
                    code.slice(0, targetIndex) +
                    content +
                    code.slice(targetIndex)
                );
            }
            return code;
        } else {
            // Inject after every occurrence, accounting for offset
            let offset = 0;
            let modifiedCode = code;
            for (const index of targetIndices) {
                modifiedCode =
                    modifiedCode.slice(0, index + offset) +
                    content +
                    modifiedCode.slice(index + offset);
                offset += content.length;
            }
            return modifiedCode;
        }
    }

    /**
     * Finds the last return statement in the main scope of a method.
     * @param code The method body code.
     * @returns The index of the last return statement, or -1 if not found in main scope.
     */
    static findLastMainScopeReturn(code: string): number {
        let lastReturnIndex = code.lastIndexOf("return");
        if (lastReturnIndex !== -1) {
            // If the number of closing braces after the last return statement is greater than 0,
            // it means that the return statement is not in the main scope of the method.
            const closingBracesCount = (
                code.slice(lastReturnIndex).match(/}/g) || []
            ).length;
            if (closingBracesCount !== 0) {
                lastReturnIndex = -1;
            }
        }
        return lastReturnIndex;
    }
}
