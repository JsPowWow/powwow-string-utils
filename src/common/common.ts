type PwStringMapper = (source: string) => string;
type PwStringValidator = (source: string) => boolean;

/**
 * @description Checks if provided value is classified as a String primitive
 * @param source The source value to check
 * @returns {boolean} Returns true if value is correctly classified as string, false otherwise.
 */
const isStringValue = (source: unknown) => typeof source === 'string' || source instanceof String;

/**
 * @description Checks if provided value is a non-empty string primitive
 * @param {string} source
 * @return {Boolean} Returns true if value is correctly classified as string with non-zero length, false otherwise
 */
const isValidAndNonEmptyString: PwStringValidator = (source: string) => {
  return isStringValue(source) && source.length > 0;
};

/**
 * @description Get a copy of source string with capitalized first character
 * @param {string} source
 * @return {string} Returns a copy of source string with capitalized first character
 */
const capitalizeFirstCharacter: PwStringMapper = (source: string) => {
  return isValidAndNonEmptyString(source) ? source.charAt(0).toUpperCase() + source.slice(1) : source;
};

const REG_EXP_CHARACTERS = /[\\^$.*+?()[\]{}|]/g;
const HAS_REG_EXP_CHARACTERS = RegExp(REG_EXP_CHARACTERS.source);

/**
 * @description Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in source `string`.
 * @param {string} source
 * @return {string}
 */
const escapeRegExpCharacters: PwStringMapper = (source: string) => {
  return isValidAndNonEmptyString(source) && HAS_REG_EXP_CHARACTERS.test(source)
    ? source.replace(REG_EXP_CHARACTERS, '\\$&')
    : source;
};

export {
  PwStringMapper,
  PwStringValidator,
  isValidAndNonEmptyString,
  capitalizeFirstCharacter,
  escapeRegExpCharacters,
};
