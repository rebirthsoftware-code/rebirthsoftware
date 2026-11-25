import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const PAROLA = "test-parola-123";
const ICERIK = path.resolve(process.env.ICERIK_KOKU ?? "./.yerel/test-icerik");

async function girisYap(page: Page) {
  await page.goto("/giris");
  await page.locator("#parola").fill(PAROLA);
  await page.getByRole("button", { name: "Giriş yap" }).click();
  await expect(page).toHaveURL(/\/$/);
}

const jsonOku = async (ad: string) => JSON.parse(await readFile(path.join(ICERIK, "content", ad), "utf8"));

test.describe("giriş", () => {
  test("oturum yokken panel girişe yönlendirir", async ({ page }) => {
    await page.goto("/projeler");
    await expect(page).toHaveURL(/\/giris$/);
    await expect(page.locator("h1")).toHaveText("Yönetim paneli");
  });

  test("yanlış parola reddedilir, doğru parola özeti açar", async ({ page }) => {
    await page.goto("/giris");
    await page.locator("#parola").fill("yanlis");
    await page.getByRole("button", { name: "Giriş yap" }).click();
    await expect(page.getByRole("alert").first()).toContainText("Parola yanlış");

    await page.locator("#parola").fill(PAROLA);
    await page.getByRole("button", { name: "Giriş yap" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toHaveText("Özet");

    // Çıkış
    await page.getByRole("button", { name: "Çıkış" }).first().click();
    await expect(page).toHaveURL(/\/giris$/);
  });

  test("arama motorlarına kapalı, PWA olarak kurulabilir", async ({ page, request }) => {
    const res = await page.goto("/giris");
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    const m = await (await request.get("/manifest.webmanifest")).json();
    expect(m.display).toBe("standalone");
    for (const ikon of m.icons as { src: string }[]) {
      expect((await request.get(ikon.src)).status(), ikon.src).toBe(200);
    }
    expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow:\s*\//);
  });
});

test.describe("panel", () => {
  test.beforeEach(async ({ page }) => girisYap(page));

  test("tüm bölümler açılıyor, tek h1, konsol hatası yok", async ({ page }) => {
    // Proje küçük resimleri canlı siteden gelir; test ortamında dışarı çıkılmaz.
    await page.route("**/projeler/*.webp", (r) =>
      r.fulfill({ status: 200, contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAAAAACw=", "base64") })
    );
    const hatalar: string[] = [];
    page.on("pageerror", (e) => hatalar.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") hatalar.push(m.text());
    });
    for (const yol of ["/", "/teklifler", "/projeler", "/projeler/yeni", "/yazilar", "/yazilar/yeni", "/hizmetler", "/hizmetler/yeni", "/musteri-siteleri", "/musteri-siteleri/yeni", "/site-bilgileri"]) {
      const res = await page.goto(yol, { waitUntil: "networkidle" });
      expect(res?.status(), yol).toBe(200);
      await expect(page.locator("h1"), yol).toHaveCount(1);
    }
    expect(hatalar).toEqual([]);
  });

  test("erişilebilirlik: özet ve proje formunda ciddi ihlal yok", async ({ page }) => {
    for (const yol of ["/", "/projeler/yeni"]) {
      await page.goto(yol, { waitUntil: "networkidle" });
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const ciddi = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(ciddi.map((v) => `${v.id}: ${v.help}`), yol).toEqual([]);
    }
  });

  test("telefonda alt gezinme çubuğu, yatay taşma yok", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const yol of ["/", "/teklifler", "/projeler", "/projeler/yeni", "/musteri-siteleri"]) {
      await page.goto(yol, { waitUntil: "networkidle" });
      const o = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
      expect(o.s, `${yol}: yatay taşma`).toBeLessThanOrEqual(o.c);
    }
    const cubuk = page.locator("nav[data-gezinme] ul:visible");
    const kutu = await cubuk.boundingBox();
    expect(Math.round(kutu!.y + kutu!.height)).toBe(844);
    await page.getByRole("link", { name: "Projeler" }).click();
    await expect(page).toHaveURL(/\/projeler$/);
  });

  test("proje ekle → listede görünür → düzenle → sil; JSON dosyası güncellenir", async ({ page }) => {
    const oncekiSayi = (await jsonOku("projeler.json")).length;

    await page.goto("/projeler/yeni");
    // Eksik formda alan bazlı hata
    await page.getByRole("button", { name: "Projeyi ekle" }).click();
    await expect(page.locator("#title-hata")).toContainText("Proje adı");

    await page.locator("#title").fill("Test Fırını Kurumsal Site");
    await page.locator("#client").fill("Test Fırını");
    await page.locator("#sector").fill("Fırın & pastane");
    await page.locator("#url").fill("https://testfirini.com");
    await page.locator("#summary").fill("Mahalle fırını için ürünleri ve siparişi tek sayfada toplayan site.");
    await page.locator("#result").fill("Siparişler form üzerinden geliyor\nMenü sitede");
    await page.locator("#stack").fill("Next.js\nVercel");
    await page.getByLabel("Ana sayfadaki vitrinde göster").check();
    await page.getByRole("button", { name: "Projeyi ekle" }).click();

    await expect(page).toHaveURL(/\/projeler\?kaydedildi=/);
    await expect(page.locator('[data-uyari="ok"]')).toContainText("Test Fırını Kurumsal Site");
    const satir = page.locator('[data-proje="test-firini-kurumsal-site"]');
    await expect(satir).toContainText("Vitrin");

    let projeler = await jsonOku("projeler.json");
    expect(projeler.length).toBe(oncekiSayi + 1);
    const yeni = projeler.find((p: { slug: string }) => p.slug === "test-firini-kurumsal-site");
    expect(yeni).toMatchObject({
      title: "Test Fırını Kurumsal Site",
      client: "Test Fırını",
      type: "Kurumsal Web Sitesi",
      url: "https://testfirini.com",
      result: ["Siparişler form üzerinden geliyor", "Menü sitede"],
      stack: ["Next.js", "Vercel"],
      featured: true,
    });
    expect(yeni.year).toMatch(/^\d{4}$/);

    // Düzenle
    await satir.getByRole("link").first().click();
    await expect(page.locator("h1")).toHaveText("Test Fırını Kurumsal Site");
    await page.locator("#title").fill("Test Fırını — Yeni Site");
    await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
    await expect(page).toHaveURL(/\/projeler\?kaydedildi=/);
    projeler = await jsonOku("projeler.json");
    expect(projeler.find((p: { slug: string }) => p.slug === "test-firini-kurumsal-site").title).toBe("Test Fırını — Yeni Site");

    // Sil
    page.once("dialog", (d) => d.accept());
    await page.locator('[data-proje="test-firini-kurumsal-site"]').getByRole("button", { name: "Sil" }).click();
    await expect(page).toHaveURL(/\/projeler\?silindi=/);
    projeler = await jsonOku("projeler.json");
    expect(projeler.length).toBe(oncekiSayi);
  });

  test("yazı: sade metin bloklara çevrilir, düzenlemede geri açılır", async ({ page }) => {
    await page.goto("/yazilar/yeni");
    await page.locator("#title").fill("Test yazısı: site bakımı neden önemli?");
    await page.locator("#excerpt").fill("Bakım sözleşmesinin içinde ne var, kısa özet.");
    await page.locator("#body").fill(
      "Giriş paragrafı burada.\n\n## Neler dahil\n\n- Güncellemeler\n- Yedekleme\n\nKapanış paragrafı."
    );
    await page.getByRole("button", { name: "Yazıyı yayınla" }).click();
    await expect(page).toHaveURL(/\/yazilar\?kaydedildi=/);

    const yazilar = await jsonOku("yazilar.json");
    const y = yazilar.find((x: { slug: string }) => x.slug === "test-yazisi-site-bakimi-neden-onemli");
    expect(y.body).toEqual([
      { p: "Giriş paragrafı burada." },
      { h: "Neler dahil", list: ["Güncellemeler", "Yedekleme"] },
      { p: "Kapanış paragrafı." },
    ]);
    expect(y.readingMinutes).toBeGreaterThanOrEqual(1);

    await page.goto(`/yazilar/${y.slug}`);
    await expect(page.locator("#body")).toHaveValue("Giriş paragrafı burada.\n\n## Neler dahil\n\n- Güncellemeler\n- Yedekleme\n\nKapanış paragrafı.");

    page.once("dialog", (d) => d.accept());
    await page.goto("/yazilar");
    await page.locator(`[data-yazi="${y.slug}"]`).getByRole("button", { name: "Sil" }).click();
    await expect(page).toHaveURL(/\/yazilar\?silindi=/);
  });

  test("hizmet düzenle: SSS satırları eşleşmeli", async ({ page }) => {
    const hizmetler = await jsonOku("hizmetler.json");
    const ilk = hizmetler[0];
    await page.goto(`/hizmetler/${ilk.slug}`);
    await page.locator("#faq_a").fill("Tek cevap");
    await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
    await expect(page.locator("#faq_a-hata")).toContainText("Her soruya karşılık");

    await page.locator("#faq_a").fill(ilk.faq.map(() => "Güncel cevap").join("\n"));
    await page.locator("#short").fill("Güncellenmiş kısa açıklama metni.");
    await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
    await expect(page).toHaveURL(/\/hizmetler\?kaydedildi=/);
    const sonra = (await jsonOku("hizmetler.json")).find((h: { slug: string }) => h.slug === ilk.slug);
    expect(sonra.short).toBe("Güncellenmiş kısa açıklama metni.");
    expect(sonra.faq.every((f: { a: string }) => f.a === "Güncel cevap")).toBe(true);
    expect(sonra.faq.length).toBe(ilk.faq.length);
  });

  test("site bilgileri: telefon ve WhatsApp türetilir", async ({ page }) => {
    await page.goto("/site-bilgileri");
    await page.locator("#phone").fill("0538 212 03 17");
    await page.locator("#whatsapp").fill("");
    await page.locator("#email").fill("merhaba@rebirthsoftware.com");
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page.locator('[data-uyari="ok"]')).toContainText("kaydedildi");
    const site = await jsonOku("site.json");
    expect(site.phoneHref).toBe("tel:+905382120317");
    expect(site.whatsapp).toBe("905382120317");
    expect(site.email).toBe("merhaba@rebirthsoftware.com");
    expect(site.stats.length).toBeGreaterThan(0);
  });

  test("müşteri sitesi ekle, yenileme uyarısı özette görünür", async ({ page }) => {
    const yakin = new Date(Date.now() + 10 * 86_400_000).toISOString().slice(0, 10);
    await page.goto("/musteri-siteleri/yeni");
    await page.locator("#ad").fill("Test Müşteri Sitesi");
    await page.locator("#musteri").fill("Test A.Ş.");
    await page.locator("#adres").fill("https://ornek-musteri.example");
    await page.locator("#yenilemeTarihi").fill(yakin);
    await page.getByRole("button", { name: "Siteyi ekle" }).click();
    await expect(page).toHaveURL(/\/musteri-siteleri\?kaydedildi=/);
    await expect(page.locator('[data-musteri="test-musteri-sitesi"]')).toContainText("Yenileme:");

    await page.goto("/");
    await expect(page.getByText("Yaklaşan yenilemeler").locator("..").locator("..")).toContainText("Test Müşteri Sitesi");

    page.once("dialog", (d) => d.accept());
    await page.goto("/musteri-siteleri");
    await page.locator('[data-musteri="test-musteri-sitesi"]').getByRole("button", { name: "Sil" }).click();
    await expect(page).toHaveURL(/\/musteri-siteleri\?silindi=/);
  });
});

test.describe("teklif formu ucu", () => {
  test("site kökeninden gelen talep kaydedilir ve panelde görünür", async ({ page, request }) => {
    // Yetkisiz köken reddedilir
    const red = await request.post("/api/teklif", {
      headers: { Origin: "https://kotu.example" },
      data: { name: "x" },
    });
    expect(red.status()).toBe(403);

    // Doğrulama hataları
    const hatali = await request.post("/api/teklif", {
      headers: { Origin: "http://127.0.0.1:3000" },
      data: { name: "a", email: "bozuk", message: "kısa", consent: false },
    });
    expect(hatali.status()).toBe(422);
    expect(Object.keys((await hatali.json()).errors).sort()).toEqual(["consent", "email", "message", "name"]);

    // Bot tuzağı sessizce yutulur
    const bot = await request.post("/api/teklif", {
      headers: { Origin: "http://127.0.0.1:3000" },
      data: { name: "Bot", email: "bot@x.com", message: "uzun bir mesaj yazıyorum", consent: true, website: "spam" },
    });
    expect((await bot.json())).toEqual({ ok: true, delivered: false });

    // Geçerli talep
    const ok = await request.post("/api/teklif", {
      headers: { Origin: "http://127.0.0.1:3000" },
      data: {
        name: "Ayşe Yılmaz",
        company: "Yılmaz Ticaret",
        email: "ayse@example.com",
        phone: "0532 000 00 00",
        service: "Kurumsal Web Sitesi",
        budget: "30.000 ₺ - 60.000 ₺",
        message: "Mevcut sitemizi yenilemek istiyoruz, 10 sayfalık bir kurumsal site.",
        consent: true,
      },
    });
    expect(ok.status()).toBe(200);
    expect(ok.headers()["access-control-allow-origin"]).toBe("http://127.0.0.1:3000");
    const govde = await ok.json();
    expect(govde.ok).toBe(true);
    expect(govde.numara).toBeGreaterThan(0);

    // Panelde görünür, yanıtlandı işaretlenir, not eklenir
    await girisYap(page);
    await expect(page.getByRole("link", { name: /Teklifler/ }).first()).toContainText("1");
    await page.goto("/teklifler");
    const satir = page.locator("[data-teklif-listesi] li").first();
    await expect(satir).toContainText("Ayşe Yılmaz");
    await expect(satir).toContainText("Yeni");
    await satir.getByRole("link").click();
    await expect(page.locator("h1")).toHaveText("Ayşe Yılmaz");
    await expect(page.getByText("Yılmaz Ticaret")).toBeVisible();
    await expect(page.getByRole("link", { name: "WhatsApp'tan yaz" })).toHaveAttribute("href", "https://wa.me/905320000000");

    await page.locator("#not").fill("Telefonla görüşüldü, teklif gönderilecek.");
    await page.getByRole("button", { name: "Not ekle" }).click();
    await expect(page.getByText("Telefonla görüşüldü, teklif gönderilecek.")).toBeVisible();

    await page.getByRole("button", { name: "Yanıtlandı olarak işaretle" }).click();
    await expect(page.getByRole("button", { name: "Yeniden aç" })).toBeVisible();
    await page.goto("/teklifler?durum=yanitlandi");
    await expect(page.locator("[data-teklif-listesi] li").first()).toContainText("Ayşe Yılmaz");
  });
});
