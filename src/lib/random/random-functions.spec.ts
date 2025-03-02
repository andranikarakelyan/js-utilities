import {randomBoolean, randomInt} from "./random-functions";

//FIXME: This test should be improved
test('randomInt: Return random integer value', () => {

  const min = 3, max = 6;
  const result = randomInt(min, max);

  expect(typeof result).toBe("number");
  expect(result % 1).toBe(0);
  expect(result).toBeGreaterThanOrEqual(min);
  expect(result).toBeLessThanOrEqual(max);
});

//FIXME: This test should be improved
test('randomBoolean: Return random boolean value', () => {

  const result = randomBoolean();

  expect(typeof result).toBe("boolean");
});