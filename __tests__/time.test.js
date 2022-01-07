const { test, expect } = require("@playwright/test");
const {
  getTestNameInnerText,
  loadData,
  setEditorText,
} = require("./page-utils");

test.describe("Time", () => {
  test("should handle multi-day intervals", async ({ page }) => {
    await loadData(page, {
      tasks: [
        {
          start: "2022-02-12",
          stop: "2022-02-13",
          name: "Spring cleaning",
          owner: "Weekend Brian",
        },
        {
          start: "2022-02-14",
          stop: "2022-02-17",
          name: "Work",
          owner: "Professional Brian",
        },
      ],
      team: {},
    });

    expect(await page.locator("canvas").screenshot()).toMatchSnapshot(
      "canvas-screenshot-days.png"
    );
  });

  test("should handle multi-week intervals", async ({ page }) => {
    await loadData(page, {
      tasks: [
        {
          name: "Do something",
          start: "2022-01-03",
          stop: "2022-01-16",
        },
        {
          name: "Also do this thing",
          start: "2022-01-10",
          stop: "2022-01-16",
        },
        {
          name: "Do something else",
          start: "2022-01-17",
          stop: "2022-01-23",
        },
      ],
      team: {},
    });

    expect(await page.locator("canvas").screenshot()).toMatchSnapshot(
      "canvas-screenshot-weeks.png"
    );
  });

  test("should handle multi-month intervals", async ({ page }) => {
    await loadData(page, {
      tasks: [
        {
          id: "example",
          name: "Design API",
          owner: "bvaughn",
          start: "2022-01-01",
          stop: "2022-03-15",
        },
        {
          id: 0,
          name: "Write API documentation",
          owner: "susan",
          start: "2022-03-01",
          stop: "2022-05-01",
          dependency: "example",
        },
        {
          id: 1,
          name: "Support product team integration",
          owner: "bvaughn",
          start: "2022-03-15",
          stop: "2022-05-15",
          isOngoing: true,
          dependency: "example",
        },
        {
          id: 2,
          name: "Finish project carryover",
          owner: "susan",
          start: "2022-01-01",
          stop: "2022-03-01",
        },
        {
          id: 3,
          name: "GitHub issue support",
          owner: "team",
          start: "2022-03-01",
          stop: "2022-04-01",
          isOngoing: true,
        },
      ],
      team: {},
    });

    expect(await page.locator("canvas").screenshot()).toMatchSnapshot(
      "canvas-screenshot-months.png"
    );
  });

  test("should handle multi-year intervals", async ({ page }) => {
    await loadData(page, {
      tasks: [
        {
          start: "2022-01-01",
          stop: "2022-06-30",
          name: "H1 2022",
        },
        {
          start: "2022-07-01",
          stop: "2022-12-31",
          name: "H2 2022",
        },
        {
          start: "2023-01-01",
          stop: "2023-06-30",
          name: "H1 2023",
        },
      ],
      team: {},
    });

    expect(await page.locator("canvas").screenshot()).toMatchSnapshot(
      "canvas-screenshot-years.png"
    );
  });
});
