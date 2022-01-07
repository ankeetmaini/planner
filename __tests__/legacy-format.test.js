const { test, expect } = require("@playwright/test");
const {
  getEditorText,
  getTestNameInnerText,
  loadData,
  setEditorText,
} = require("./page-utils");

test.describe("Legacy format", () => {
  test("should auto migrate legacy data format", async ({ page }) => {
    await loadData(page, {
      tasks: [
        {
          duration: 2.5,
          id: "example",
          name: "Design API",
          owner: "bvaughn",
          start: 0,
        },
        {
          duration: 1,
          id: 0,
          name: "Write API documentation",
          owner: "susan",
          start: 2,
          dependency: "example",
        },
        {
          duration: 2,
          id: 1,
          name: "Support product team integration",
          owner: "bvaughn",
          start: 2.5,
          isOngoing: true,
          dependency: "example",
        },
        {
          duration: 2,
          id: 2,
          name: "Finish project carryover",
          owner: "susan",
          start: 0,
        },
        {
          duration: 1,
          id: 3,
          name: "GitHub issue support",
          owner: "team",
          start: 2,
          isOngoing: true,
        },
      ],
      team: {},
    });

    expect(await page.locator("canvas").screenshot()).toMatchSnapshot(
      "canvas-screenshot-legacy.png"
    );

    expect(await getEditorText(page, "tasks")).toMatchSnapshot("code-text.txt");
  });
});
