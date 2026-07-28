import { describe, expect, it } from "vitest";

import { getStateColor } from "../src/palette";

describe("getStateColor", () => {
  it("returns a stable automatic color for a state", () => {
    expect(getStateColor("Living Room", {})).toBe(getStateColor("Living Room", {}));
    expect(getStateColor("Living Room", {})).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("uses an explicit state override", () => {
    expect(getStateColor("Kitchen", { Kitchen: "#123456" })).toBe("#123456");
  });
});
