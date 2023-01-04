export const capitalizeFirstCharacter = source => {
    return source && source.length > 0
        ? source.charAt(0).toUpperCase() + source.slice(1)
        : source;
};
