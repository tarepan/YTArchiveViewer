import { func1 } from "./func1";

test("func1 should double input", (): void => {
  expect(func1(2)).toBe("4");
});
