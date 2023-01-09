import { PwStringMapper, PwStringValidator, isValidAndNonEmptyString, escapeRegExpCharacters } from '../common/common';

type PwStringMatchesOptions = {
  searchTerm: string;
  ignoreCase?: boolean;
  sanitize?: PwStringMapper;
};

const defaultSanitize: PwStringMapper = (source: string) => {
  if (isValidAndNonEmptyString(source)) {
    return source;
  }
  return '';
};

/**
 * @description HOF to build safe "sanitize" routine per provided {@link PwStringMatchesOptions}
 * @param {PwStringMatchesOptions} options
 * @return {PwStringMapper}
 */
const withUseSanitize = (options: PwStringMatchesOptions): PwStringMapper => {
  const sanitize = typeof options?.sanitize === 'function' ? options.sanitize : defaultSanitize;
  return (source: string) => sanitize(source) ?? '';
};

/**
 * @description Create safe RegExp instance per provided {@link PwStringMatchesOptions}
 * @param {PwStringMatchesOptions} options
 * @return {RegExp}
 */
const usingRegExp = (options: PwStringMatchesOptions) => {
  return new RegExp(options?.searchTerm, !!options?.ignoreCase ? 'gi' : 'g');
};

/**
 * @description HOF to build safe "hasMatches" routine per provided {@link PwStringMatchesOptions}
 * @param {PwStringMatchesOptions} options
 * @return {PwStringValidator}
 */
const withHasMatches = (options: PwStringMatchesOptions): PwStringValidator => {
  const sanitize = withUseSanitize(options);
  const regExp = usingRegExp({ ...options, searchTerm: escapeRegExpCharacters(options?.searchTerm) });
  return (source) => {
    if (isValidAndNonEmptyString(source)) {
      return regExp.test(sanitize(source));
    }
    return false;
  };
};

export { PwStringMatchesOptions, withHasMatches };
