import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Alt dizinde yayınlanan sürümü (GitHub Pages) de test edebilmek için
 * rotalar BASE_PATH ile öneklenir. Boşsa kök dizinde çalışır.
 */
const BASE_PATH = process.env.BASE_PATH ?? "";
const yol = (p: string) => `${BASE_PATH}${p}`;

/** Sitedeki tüm statik rotalar */
const ROUTES = [
  "/",
  "/hizmetler",
  "/hizmetler/kurumsal-web-sitesi",
  "/projeler",
  "/projeler/endamsince-1979",
  "/blog",
  "/blog/site-hizi-neden-onemli",
  "/surec",
  "/hakkimizda",
  "/sss",
  "/teklif-al",
  "/iletisim",
  "/kvkk",
  "/gizlilik",
  "/satis",
];

test.describe("sayfalar", () => {
  for (const route of ROUTES) {
    test(`${route} açılıyor, konsol hatası yok`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      const res = await page.goto(yol(route), { waitUntil: "networkidle" });
      expect(res?.status(), `${route} durum kodu`).toBe(200);

      // Her sayfada tek bir h1 ve dolu bir başlık olmalı
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);

      expect(errors, `${route} konsol hataları`).toEqual([]);
    });
  }
});

test("erişilebilirlik: ana sayfada ciddi ihlal yok", async ({ page }) => {
  await page.goto(yol("/"), { waitUntil: "networkidle" });
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
  await page.goto(yol("/teklif-al"), { waitUntil: "networkidle" });
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
  await page.goto(yol("/hizmetler"), { waitUntil: "networkidle" });

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
  // Statik dışa aktarımda sunucu rotası yoktur; bu test yalnızca tam sürümde anlamlı.
  test.skip(!!BASE_PATH, "statik sürümde /api yok");
  await page.goto(yol("/teklif-al"), { waitUntil: "networkidle" });
  const res = await page.request.post(yol("/api/teklif"), {
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
  await page.goto(yol("/"), { waitUntil: "networkidle" });
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

test("proje görselleri yükleniyor (basePath dahil)", async ({ page }) => {
  await page.goto(yol("/projeler"), { waitUntil: "networkidle" });
  const imgs = page.locator("img");
  const adet = await imgs.count();
  expect(adet, "projeler sayfasında görsel bulunmalı").toBeGreaterThan(0);

  const bozuk: string[] = [];
  for (let i = 0; i < adet; i++) {
    const el = imgs.nth(i);
    const src = await el.getAttribute("src");
    const yuklendi = await el.evaluate(
      (n: HTMLImageElement) => n.complete && n.naturalWidth > 0
    );
    if (!yuklendi) bozuk.push(src ?? "(src yok)");
  }
  expect(bozuk, "yüklenemeyen görseller").toEqual([]);
});

test("ana sayfa vitrini: başta hizalı, oklarla kayıyor, sürükleme tıklamıyor", async ({
  page,
}) => {
  await page.goto(yol("/"), { waitUntil: "networkidle" });
  const vitrin = page.locator('[role="region"][aria-label="Projeler"]');
  await vitrin.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Açılışta ilk kart kenara yaslanmamalı (scroll-padding kontrolü)
  const baslangic = await vitrin.evaluate((el) => ({
    scrollLeft: el.scrollLeft,
    padLeft: parseFloat(getComputedStyle(el).paddingLeft),
    kartSol: el
      .querySelector("[data-kart]")!
      .getBoundingClientRect().left,
    kapsayiciSol: el.getBoundingClientRect().left,
  }));
  expect(baslangic.scrollLeft, "açılışta kaydırma sıfır olmalı").toBe(0);
  expect(
    Math.round(baslangic.kartSol - baslangic.kapsayiciSol),
    "ilk kart sol boşluk kadar içeride olmalı"
  ).toBe(Math.round(baslangic.padLeft));

  // Gerçekten kaydırılacak içerik var mı
  const tasma = await vitrin.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(tasma, "vitrinde kaydırılacak pay olmalı").toBeGreaterThan(50);

  // Sonraki düğmesi kaydırıyor mu
  const ileri = page.locator('button[aria-label="Sonraki projeler"]');
  await expect(ileri).toBeEnabled();
  await ileri.click();
  await page.waitForTimeout(900);
  expect(await vitrin.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

  // Uca kadar ilerle — proje sayısından bağımsız olsun diye döngü ile.
  for (let i = 0; i < 12 && (await ileri.isEnabled()); i++) {
    await ileri.click();
    await page.waitForTimeout(700);
  }
  await expect(ileri, "uçta sonraki düğmesi pasifleşmeli").toBeDisabled();
  await expect(page.locator('button[aria-label="Önceki projeler"]')).toBeEnabled();

  // Sürükleme kartı açmamalı
  const kutu = await vitrin.boundingBox();
  await page.mouse.move(kutu!.x + kutu!.width * 0.5, kutu!.y + kutu!.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(kutu!.x + kutu!.width * 0.2, kutu!.y + kutu!.height * 0.4, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  expect(new URL(page.url()).pathname, "sürükleyince sayfa değişmemeli").toBe(
    yol("/") === "/" ? "/" : `${BASE_PATH}/`
  );
});

test("iletişim bilgilerinde yer tutucu kalmamalı", async ({ page }) => {
  // Yer tutucu numara/adres yayına çıkarsa gelen arama kaybedilir.
  const yerTutucular = [
    "555 000 00 00",
    "905550000000",
    "+905550000000",
    "0000 000",
  ];

  for (const rota of ["/", "/iletisim", "/teklif-al"]) {
    await page.goto(yol(rota), { waitUntil: "networkidle" });
    const html = await page.content();
    const bulunan = yerTutucular.filter((y) => html.includes(y));
    expect(bulunan, `${rota} sayfasında yer tutucu iletişim bilgisi`).toEqual([]);
  }

  // Telefon bağlantısı gerçek bir numaraya gitmeli
  const telHref = await page
    .locator('a[href^="tel:"]')
    .first()
    .getAttribute("href");
  expect(telHref).toMatch(/^tel:\+90\d{10}$/);
});

test("SEO: sitemap, robots ve RSS yayında", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/feed.xml"]) {
    const res = await request.get(yol(path));
    expect(res.status(), path).toBe(200);
    expect((await res.text()).length, path).toBeGreaterThan(50);
  }
});

test.describe("barkodlu satış sistemi", () => {
  test("erişilebilirlik: satış sayfasında ciddi ihlal yok", async ({ page }) => {
    await page.goto(yol("/satis"), { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const ciddi = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    expect(ciddi.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test("ürün ekle → barkod okut → satışı tamamla → stok düşer, rapor işlenir", async ({
    page,
  }) => {
    await page.goto(yol("/satis"), { waitUntil: "networkidle" });

    // Bağımsız sayfa: işletme adı var, site başlığı/alt bilgisi yok
    await expect(page.locator("h1")).toContainText("İnci Motors");
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(page.locator('button[aria-controls="mobil-menu"]')).toHaveCount(0);

    // Boş başlangıç: sepet boş, ürün yok
    await expect(page.getByText("Sepet boş", { exact: false })).toBeVisible();

    // Stok sekmesinde ürün tanımla (geçerli EAN-13)
    await page.getByRole("tab", { name: "Stok" }).click();
    await page.getByRole("button", { name: "+ Yeni ürün" }).click();
    await page.locator("#stok-urun-barkod").fill("8690504012344");
    await page.locator("#stok-urun-ad").fill("Test Kahve");
    await page.locator("#stok-urun-fiyat").fill("85,50");
    await page.locator("#stok-urun-stok").fill("3");
    await page.locator("#stok-urun-kritik").fill("1");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    await expect(page.locator('[data-urun="8690504012344"] [data-stok]')).toHaveText("3");

    // Geçersiz kontrol hanesi reddedilmeli
    await page.getByRole("button", { name: "+ Yeni ürün" }).click();
    await page.locator("#stok-urun-barkod").fill("8690504012345");
    await page.locator("#stok-urun-ad").fill("Bozuk");
    await page.locator("#stok-urun-fiyat").fill("1");
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    await expect(page.getByText("kontrol hanesi tutmuyor")).toBeVisible();
    await page.getByRole("button", { name: "Vazgeç" }).click();

    // Satış: barkodu iki kez okut (okuyucu Enter gönderir)
    await page.getByRole("tab", { name: "Satış" }).click();
    const barkod = page.locator("#barkod-giris");
    await barkod.fill("8690504012344");
    await barkod.press("Enter");
    await barkod.fill("8690504012344");
    await barkod.press("Enter");
    await expect(page.locator('[data-sepet-satir="8690504012344"] [data-adet]')).toHaveText("2");
    await expect(page.locator("[data-toplam]")).toHaveText("₺171,00");

    // Stoğu aşan ekleme engellenir
    await barkod.fill("8690504012344");
    await barkod.press("Enter");
    await barkod.fill("8690504012344");
    await barkod.press("Enter");
    await expect(page.locator('[data-bildirim="hata"]')).toContainText("yalnızca 3 adet");
    await expect(page.locator('[data-sepet-satir="8690504012344"] [data-adet]')).toHaveText("3");

    // Bilinmeyen barkod hızlı ürün formunu açar
    await barkod.fill("4006381333931");
    await barkod.press("Enter");
    await expect(page.locator("#hizli-urun-barkod")).toHaveValue("4006381333931");
    await page.getByRole("button", { name: "Vazgeç" }).click();

    // Kart ile tamamla
    await page.locator("#panel-satis").getByText("Kart", { exact: true }).click();
    await expect(page.getByLabel("Kart", { exact: true })).toBeChecked();
    await page.getByRole("button", { name: "Satışı tamamla" }).click();
    await expect(page.locator("[data-son-fis]")).toContainText("₺256,50");
    await expect(page.getByText("Sepet boş", { exact: false })).toBeVisible();

    // Stok düştü
    await page.getByRole("tab", { name: "Stok" }).click();
    await expect(page.locator('[data-urun="8690504012344"] [data-stok]')).toHaveText("0");

    // Stok düzeltme: sayım sonucu 7 girilir
    await page.locator('[data-urun="8690504012344"]').getByRole("button", { name: "Stok düzelt" }).click();
    const duzelt = page.locator("[data-stok-duzelt]");
    await duzelt.fill("7");
    await duzelt.press("Enter");
    await expect(page.locator('[data-urun="8690504012344"] [data-stok]')).toHaveText("7");
    await page.locator('[data-urun="8690504012344"]').getByRole("button", { name: "Stok düzelt" }).click();
    await page.locator("[data-stok-duzelt]").fill("0");
    await page.locator("[data-stok-duzelt]").press("Enter");
    await expect(page.locator('[data-urun="8690504012344"] [data-stok]')).toHaveText("0");

    // Rapor işlendi
    await page.getByRole("tab", { name: "Raporlar" }).click();
    await expect(page.locator('[data-rapor="Bugünkü ciro"]')).toHaveText("₺256,50");
    await expect(page.locator("[data-satis-listesi] li")).toHaveCount(1);

    // Sayfa yenilenince veri kalıcı
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Raporlar" }).click();
    await expect(page.locator("[data-satis-listesi] li")).toHaveCount(1);

    // İade: stok geri gelir
    page.once("dialog", (d) => d.accept());
    await page.locator("[data-satis-listesi] li button").first().click();
    await page.getByRole("button", { name: "İade et" }).click();
    await expect(page.locator('[data-rapor="Bugünkü ciro"]')).toHaveText("₺0,00");
    await page.getByRole("tab", { name: "Stok" }).click();
    await expect(page.locator('[data-urun="8690504012344"] [data-stok]')).toHaveText("3");
  });
});
