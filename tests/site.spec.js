// @ts-check
const { test, expect } = require("@playwright/test");

const pages = [
  { path: "/", lang: "en", heading: "Ask your photos.", notice: "The Sepiabox name and logo: all rights reserved." },
  { path: "/pt-br/", lang: "pt-BR", heading: "Pergunte às suas fotos.", notice: "Nome e logo Sepiabox: todos os direitos reservados." },
];

for (const { path, lang, heading, notice } of pages) {
  test.describe(`${lang} page`, () => {
    test("has the sections the navigation links to", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      for (const id of ["como", "perguntas", "privacidade"]) {
        await expect(page.locator(`section#${id}`)).toHaveCount(1);
      }
    });

    test("does not scroll horizontally on a 375 px phone", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test("shows the hero and the brand notice", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.locator("footer")).toContainText("© 2026 Sepiabox");
      await expect(page.locator("footer")).toContainText(notice);
    });

    test("loads its stylesheet and images", async ({ page }) => {
      const failed = [];
      page.on("response", (response) => {
        if (new URL(response.url()).host === "127.0.0.1:4173" && response.status() >= 400) {
          failed.push(response.url());
        }
      });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(failed).toEqual([]);
      for (const img of await page.locator("img").all()) {
        expect(await img.evaluate((el) => /** @type {HTMLImageElement} */ (el).naturalWidth)).toBeGreaterThan(0);
      }
    });

    test("links both languages in the head", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://sepiabox.com/");
      await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute("href", "https://sepiabox.com/pt-br/");
    });

    test("does not mention open source, GitHub or a waitlist", async ({ page }) => {
      await page.goto(path);
      const html = (await page.content()).toLowerCase();
      for (const word of ["github", "open source", "código aberto", "source code", "agpl", "waitlist", "lista de espera", "e-mail", "type=\"email\""]) {
        expect(html).not.toContain(word);
      }
    });
  });
}

test("the language switch goes from English to pt-BR and back", async ({ page }) => {
  await page.goto("/");
  const toPortuguese = page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "PT-BR" });
  await expect(toPortuguese).toHaveAttribute("hreflang", "pt-BR");
  await toPortuguese.click();
  await expect(page).toHaveURL(/\/pt-br\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  const toEnglish = page.getByRole("navigation", { name: "Idioma" }).getByRole("link", { name: "EN" });
  await expect(toEnglish).toHaveAttribute("hreflang", "en");
  await toEnglish.click();
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
