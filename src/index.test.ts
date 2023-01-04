import { capitalizeFirstCharacter, isValidAndNonEmptyString } from './index';

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
