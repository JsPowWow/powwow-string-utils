import { PwStringMapper } from '../types';

const isValidAndNonEmptyString = (source: unknown): boolean => {
  return typeof source === 'string' && source.length > 0;
};

const capitalizeFirstCharacter: PwStringMapper = (source) => {
  return isValidAndNonEmptyString(source)
    ? source.charAt(0).toUpperCase() + source.slice(1)
    : source;
};

export { isValidAndNonEmptyString, capitalizeFirstCharacter };
