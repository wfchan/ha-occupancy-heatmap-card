import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`${theme} dashboard renders both heatmap modes without layout errors`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`/?theme=${theme}`);
    await expect(
      page.getByRole("heading", { name: "Living room activity" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rocky location" })).toBeVisible();

    const cards = page.locator("occupancy-heatmap-card");
    await expect(cards).toHaveCount(2);
    const cells = page.locator("occupancy-heatmap-card button.cell");
    await expect(cells).toHaveCount(336);

    const activeCells = page.locator(
      "occupancy-heatmap-card button.cell.filled:not(:disabled)"
    );
    const activeCount = await activeCells.count();
    expect(activeCount).toBeGreaterThan(0);
    await activeCells.nth(0).click();
    await expect(page.locator("occupancy-heatmap-card .details strong")).not.toHaveCount(
      0
    );

    const layout = await page.evaluate(() => {
      const cardElements = [...document.querySelectorAll("occupancy-heatmap-card")];
      const headings = cardElements.map((card) => {
        const heading = card.shadowRoot?.querySelector("h2");
        const cardRect = card.getBoundingClientRect();
        const headingRect = heading?.getBoundingClientRect();
        return {
          cardRight: cardRect.right,
          headingRight: headingRect?.right ?? 0,
          headingLeft: headingRect?.left ?? 0,
          cardLeft: cardRect.left,
        };
      });
      return {
        bodyScrolls:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
        headings,
        matricesScroll: cardElements.map((card) => {
          const scroll = card.shadowRoot?.querySelector(".scroll");
          return scroll ? scroll.scrollWidth > scroll.clientWidth : true;
        }),
      };
    });
    expect(layout.bodyScrolls).toBe(false);
    expect(
      layout.headings.every(
        (heading) =>
          heading.headingLeft >= heading.cardLeft &&
          heading.headingRight <= heading.cardRight
      )
    ).toBe(true);
    if (testInfo.project.name === "desktop") {
      expect(layout.matricesScroll).toEqual([false, false]);
    }
    expect(errors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`heatmap-${theme}.png`),
      fullPage: true,
    });
    if (theme === "dark" && testInfo.project.name === "desktop") {
      await page.locator("main").screenshot({ path: "docs/images/preview-dark.png" });
    }
  });
}

test("mobile keeps the page fitted and scrolls only the heatmap matrix", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only viewport assertion");
  await page.goto("/?theme=dark");
  await expect(page.getByRole("heading", { name: "Living room activity" })).toBeVisible();

  const fit = await page.evaluate(() => {
    const card = document.querySelector("occupancy-heatmap-card");
    const scroll = card?.shadowRoot?.querySelector(".scroll");
    if (!(scroll instanceof HTMLElement))
      throw new Error("Heatmap scroll region missing");
    return {
      pageScrollsX:
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
      matrixScrollsX: scroll.scrollWidth > scroll.clientWidth,
      cardWidth: card?.getBoundingClientRect().width ?? 0,
      viewportWidth: window.innerWidth,
    };
  });

  expect(fit.pageScrollsX).toBe(false);
  expect(fit.matrixScrollsX).toBe(true);
  expect(fit.cardWidth).toBeLessThanOrEqual(fit.viewportWidth);
});
