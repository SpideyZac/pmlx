/**
 * Escapes special characters in a string for use in a regular expression.
 * @param string The string to escape for use in a regular expression.
 * @returns The escaped string.
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { escapeRegExp };
