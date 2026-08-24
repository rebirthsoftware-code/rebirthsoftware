import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Sitedeki tüm statik rotalar */
const ROUTES = [
  "/",
  "/hizmetler",
  "/hizmetler/kurumsal-web-sitesi",
  "/projeler",
  "/projeler/atlas-muhendislik",
  "/blog",
  "/blog/site-hizi-neden-onemli",
  "/surec",
  "/hakkimizda",
  "/sss",
  "/teklif-al",
  "/iletisim",
  "/kvkk",
  "/gizlilik",
];

test.describe("sayfalar", () => {
  for (const route of ROUTES) {
    test(`${route} açılıyor, konsol hatası yok`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      const res = await page.goto(route, { waitUntil: "networkidle" });
      expect(res?.status(), `${route} durum kodu`).toBe(200);

      // Her sayfada tek bir h1 ve dolu bir başlık olmalı
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);

      expect(errors, `${route} konsol hataları`).toEqual([]);
    });
  }
});

test("erişilebilirlik: ana sayfada ciddi ihlal yok", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const ciddi = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical"
  );
  expect(
    ciddi.map((v) => `${v.id}: ${v.help}`),
    "ciddi erişilebilirlik ihlalleri"
  ).toEqual([]);
});

test("erişilebilirlik: teklif formunda ciddi ihlal yok", async ({ page }) => {
  await page.goto("/teklif-al", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const ciddi = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical"
  );
  expect(ciddi.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test("mobil menü: açılıyor, Esc kapatıyor, odak düğmeye dönüyor", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hizmetler", { waitUntil: "networkidle" });

  const toggle = page.locator('button[aria-controls="mobil-menu"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const menu = page.locator("#mobil-menu");
  await expect(menu).toHaveAttribute("aria-modal", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.waitForTimeout(600);
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("teklif formu: boş gönderimde alan bazlı hata gösteriyor", async ({
  page,
}) => {
  await page.goto("/teklif-al", { waitUntil: "networkidle" });
  const res = await page.request.post("/api/teklif", {
    data: { name: "a", email: "bozuk", message: "kısa", consent: false },
  });
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(Object.keys(body.errors).sort()).toEqual([
    "consent",
    "email",
    "message",
    "name",
  ]);
});

test("iç bağlantıların hiçbiri kırık değil", async ({ page, request }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const hrefs = await page.$$eval("a[href^='/']", (as) =>
    Array.from(new Set(as.map((a) => a.getAttribute("href")!)))
  );

  const kirik: string[] = [];
  for (const href of hrefs) {
    const res = await request.get(href);
    if (res.status() >= 400) kirik.push(`${href} → ${res.status()}`);
  }
  expect(kirik).toEqual([]);
});

test("SEO: sitemap, robots ve RSS yayında", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/feed.xml"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect((await res.text()).length, path).toBeGreaterThan(50);
  }
});
