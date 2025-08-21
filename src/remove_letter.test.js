import RemoveLetter from './remove_letter';
import { expect, test } from 'vitest';

test('empty string remove letter', () => {
  let word = ""
  let result = new Set(RemoveLetter(word));
  let expected = new Set();
  expect(result).toStrictEqual(expected);
});

test('beast remove letter', () => {
  let word = "beast"
  let result = new Set(RemoveLetter(word));
  let expected = new Set(["east", "best", "beat", "bast"]);
  expect(result).toStrictEqual(expected);
});

test('boast remove letter', () => {
  let word = "boast"
  let result = new Set(RemoveLetter(word));
  let expected = new Set(["bast", "oast", "boat", "boas"]);
  expect(result).toStrictEqual(expected);
});

test('it remove letter', () => {
  let word = "ti"
  let result = new Set(RemoveLetter(word));
  let expected = new Set(["i", "t"]);
  expect(result).toStrictEqual(expected);
});

test('rings remove letter', () => {
  let word = "rings"
  let result = new Set(RemoveLetter(word));
  let expected = new Set(["ring", "rigs", "rins"]);
  expect(result).toStrictEqual(expected);
});
