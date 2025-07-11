import { formattedDate } from "../../utils/formatted-date";
import { describe, it, expect } from "vitest";

describe("formattedDate", () => {
  it("retourne la date au format 'jeudi 15 mai 2025' pour une date précise", () => {
    expect(formattedDate("2025-05-15T00:00:00.000Z")).toBe("jeudi 15 mai 2025");
  });
  it("retourne une chaîne vide si la date est undefined", () => {
    expect(formattedDate(undefined)).toBe("");
  });
});
