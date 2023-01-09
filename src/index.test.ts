import { capitalizeFirstCharacter, isValidAndNonEmptyString, escapeRegExpCharacters, withHasMatches } from './index';

describe('isValidAndNonEmptyString tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${false}
    ${null}           | ${false}
    ${''}             | ${false}
    ${' '}            | ${true}
    ${['foo', 'bar']} | ${false}
    ${{ foo: 'bar' }} | ${false}
    ${10}             | ${false}
    ${'some string'}  | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(isValidAndNonEmptyString(value)).toStrictEqual(expected);
  });
});

describe('capitalizeFirstCharacter tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${undefined}
    ${null}           | ${null}
    ${''}             | ${''}
    ${' '}            | ${' '}
    ${'phrase'}       | ${'Phrase'}
    ${['foo', 'bar']} | ${['foo', 'bar']}
    ${{ foo: 'bar' }} | ${{ foo: 'bar' }}
    ${10}             | ${10}
    ${'two words'}    | ${'Two words'}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(capitalizeFirstCharacter(value)).toStrictEqual(expected);
  });
});

describe('escapeRegExpCharacters tests', () => {
  test.each`
    value             | expected
    ${undefined}      | ${undefined}
    ${null}           | ${null}
    ${''}             | ${''}
    ${' '}            | ${' '}
    ${'phrase'}       | ${'phrase'}
    ${['foo', 'bar']} | ${['foo', 'bar']}
    ${{ foo: 'bar' }} | ${{ foo: 'bar' }}
    ${10}             | ${10}
    ${'^$'}           | ${'\\^\\$'}
    ${'\\'}           | ${'\\\\'}
    ${'.*+*?|'}       | ${'\\.\\*\\+\\*\\?\\|'}
    ${'()[]{}'}       | ${'\\(\\)\\[\\]\\{\\}'}
  `('"$value" -> $expected', ({ value, expected }) => {
    expect(escapeRegExpCharacters(value)).toStrictEqual(expected);
  });
});

const TEST_STRING_BASIC = 'Good test "Phrase" to find match[es] ?';
describe(`withHasMatches (non sensitive) tests: "${TEST_STRING_BASIC}"`, () => {
  test.each`
    value                 | expected
    ${{ term: 'y' }}      | ${false}
    ${{ term: 'g' }}      | ${true}
    ${{ term: 'phrase' }} | ${true}
    ${{ term: 'Phrase' }} | ${true}
    ${{ term: '?' }}      | ${true}
    ${{ term: 's]' }}     | ${true}
    ${{ term: '[eS' }}    | ${true}
    ${{ term: '[es' }}    | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    const hasMatches = withHasMatches({
      searchTerm: value.term,
      ignoreCase: true,
    });
    expect(hasMatches(TEST_STRING_BASIC)).toStrictEqual(expected);
  });
});

describe(`withHasMatches (sensitive) tests: "${TEST_STRING_BASIC}"`, () => {
  test.each`
    value                 | expected
    ${{ term: 'y' }}      | ${false}
    ${{ term: 'g' }}      | ${false}
    ${{ term: 'phrase' }} | ${false}
    ${{ term: 'Phrase' }} | ${true}
    ${{ term: '?' }}      | ${true}
    ${{ term: 's]' }}     | ${true}
    ${{ term: '[eS' }}    | ${false}
    ${{ term: '[es' }}    | ${true}
  `('"$value" -> $expected', ({ value, expected }) => {
    const hasMatches = withHasMatches({
      searchTerm: value.term,
      ignoreCase: false,
    });
    expect(hasMatches(TEST_STRING_BASIC)).toStrictEqual(expected);
  });
});

describe(`withHasMatches safety tests`, () => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  it('not throw an exception(s) having unexpected config/params values', () => {
    // @ts-ignore
    expect(withHasMatches(undefined)(undefined)).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches(null)(null)).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches({ searchTerm: null })()).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches({ searchTerm: undefined })()).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches({ searchTerm: 'find me' })(null)).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches({ searchTerm: 'find me' })(undefined)).toStrictEqual(false);
    // @ts-ignore
    expect(withHasMatches({ searchTerm: 'find me', sanitize: true })('test me')).toStrictEqual(false);
    // @ts-ignore
    expect(
      withHasMatches({
        searchTerm: 'find me',
        // @ts-ignore
        sanitize: () => {
          /* This is intentional */
        },
      })('test me'),
    ).toStrictEqual(false);
  });
  /* eslint-enable @typescript-eslint/ban-ts-comment */
});
