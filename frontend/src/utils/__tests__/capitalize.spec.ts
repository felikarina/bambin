import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "../capitalize";

// Capitalize utility tests

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a lowercase word", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("should return an empty string if input is empty", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should not change the first letter if it is already uppercase", () => {
    expect(capitalizeFirstLetter("Hello")).toBe("Hello");
  });

  it("should only capitalize the first character and leave the rest unchanged", () => {
    expect(capitalizeFirstLetter("hELLO")).toBe("HELLO");
  });

  it("should work with a single character string", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
    expect(capitalizeFirstLetter("A")).toBe("A");
  });

  it("should handle strings starting with a non-letter character", () => {
    expect(capitalizeFirstLetter("1hello")).toBe("1hello");
    expect(capitalizeFirstLetter("!hello")).toBe("!hello");
  });

  it("should handle strings with leading spaces", () => {
    expect(capitalizeFirstLetter(" hello")).toBe(" hello");
  });
});
