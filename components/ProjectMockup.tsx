import type { Project } from "@/lib/projects";

/**
 * Proje ekran görüntüsü yoksa, proje türüne göre stilize bir arayüz
 * çizimi üretir. Varyasyonlar slug'dan türetildiği için her proje
 * farklı görünür ama her derlemede aynı kalır.
 */
export function ProjectMockup({ project }: { project: Project }) {
  const seed = project.slug
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);

  if (project.type === "Kişiye Özel Yazılım") return <DashboardMock seed={seed} />;
  if (project.type === "Web Tasarım") return <MobileMock seed={seed} />;
  return <SiteMock seed={seed} />;
}

const bar = "rounded-full bg-ink/15";
const barSoft = "rounded-full bg-ink/[0.08]";
const block = "rounded-sm bg-ink/[0.06]";

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-paper-2 p-[5%]">
      <div className="flex items-center gap-1.5 pb-[3.5%]">
        <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/10" />
        <span className="ml-2 h-2.5 flex-1 rounded-full bg-white" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-sm bg-white p-[4%]">
        {children}
      </div>
    </div>
  );
}

function TopNav({ accentRight = true }: { accentRight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${bar} h-1.5 w-8`} />
      <div className="flex items-center gap-1.5">
        <span className={`${barSoft} h-1.5 w-4`} />
        <span className={`${barSoft} h-1.5 w-4`} />
        <span className={`${barSoft} h-1.5 w-4`} />
        {accentRight ? (
          <span className="h-3 w-6 rounded-full bg-flame" />
        ) : (
          <span className="h-3 w-6 rounded-full bg-ink" />
        )}
      </div>
    </div>
  );
}

/** Kurumsal site — üç farklı hero düzeni arasında dönüşümlü */
function SiteMock({ seed }: { seed: number }) {
  const variant = seed % 3;

  return (
    <Chrome>
      <div className="flex h-full flex-col gap-[4%]">
        <TopNav accentRight={variant !== 1} />

        {variant === 0 && (
          <>
            <div className="mt-[3%] space-y-1.5">
              <span className={`${bar} block h-2.5 w-[72%]`} />
              <span className={`${bar} block h-2.5 w-[48%]`} />
              <span className={`${barSoft} mt-1 block h-1.5 w-[62%]`} />
            </div>
            <div className="flex gap-1.5">
              <span className="h-3.5 w-12 rounded-full bg-ink" />
              <span className="h-3.5 w-10 rounded-full border border-ink/15" />
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={block} />
              ))}
            </div>
          </>
        )}

        {variant === 1 && (
          <>
            <div className="flex min-h-0 flex-1 gap-[4%]">
              <div className="flex w-[52%] flex-col justify-center gap-1.5">
                <span className={`${bar} h-2.5 w-[90%]`} />
                <span className={`${bar} h-2.5 w-[65%]`} />
                <span className={`${barSoft} mt-1 h-1.5 w-[85%]`} />
                <span className={`${barSoft} h-1.5 w-[70%]`} />
                <span className="mt-1.5 h-3.5 w-14 rounded-full bg-flame" />
              </div>
              <div className={`${block} flex-1`} />
            </div>
            <div className="grid h-[22%] grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-sm border border-ink/10" />
              ))}
            </div>
          </>
        )}

        {variant === 2 && (
          <>
            <div className="mt-[4%] flex flex-col items-center gap-1.5">
              <span className={`${bar} h-2.5 w-[60%]`} />
              <span className={`${bar} h-2.5 w-[40%]`} />
              <span className={`${barSoft} mt-1 h-1.5 w-[55%]`} />
              <span className="mt-1.5 h-3.5 w-14 rounded-full bg-ink" />
            </div>
            <div className="flex min-h-0 flex-1 gap-1.5">
              <div className={`${block} w-[46%]`} />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className={`${block} flex-1`} />
                <div className="flex-1 rounded-sm bg-flame/15" />
              </div>
            </div>
          </>
        )}
      </div>
    </Chrome>
  );
}

/** Kişiye özel yazılım — kenar menü + grafik + tablo */
function DashboardMock({ seed }: { seed: number }) {
  const rows = 4 + (seed % 3);
  const heights = [42, 68, 34, 88, 56, 74, 48];
  const hot = seed % heights.length;

  return (
    <Chrome>
      <div className="flex h-full gap-[3.5%]">
        {/* kenar menü */}
        <div className="flex w-[20%] flex-col gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-flame" />
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`${barSoft} h-1.5 w-full`} />
          ))}
          <span className={`${barSoft} mt-auto h-1.5 w-[70%]`} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[4%]">
          {/* özet kutuları */}
          <div className="grid h-[16%] grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-center gap-1 rounded-sm border border-ink/10 px-1.5"
              >
                <span className={`${barSoft} h-1 w-[60%]`} />
                <span className={`${bar} h-1.5 w-[40%]`} />
              </div>
            ))}
          </div>

          {/* grafik */}
          <div className="flex h-[30%] items-end gap-1">
            {heights.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background:
                    i === hot ? "var(--color-flame)" : "rgb(20 20 15 / 0.12)",
                }}
              />
            ))}
          </div>

          {/* tablo */}
          <div className="flex min-h-0 flex-1 flex-col gap-1.5">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className={`${bar} h-1.5 flex-1`} />
                <span className={`${barSoft} h-1.5 w-6`} />
                <span
                  className="h-1.5 w-3 rounded-full"
                  style={{
                    background:
                      i === 1 ? "var(--color-flame)" : "rgb(20 20 15 / 0.1)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/** Web tasarım — telefon + renk paleti */
function MobileMock({ seed }: { seed: number }) {
  return (
    <div className="flex h-full w-full items-stretch gap-[5%] bg-paper-2 p-[6%]">
      <div className="flex w-[36%] flex-col gap-1.5 rounded-lg border border-ink/12 bg-white p-[6%]">
        <span className="mx-auto h-1 w-5 rounded-full bg-ink/15" />
        <span className={`${bar} mt-1 h-2 w-[80%]`} />
        <span className={`${barSoft} h-1.5 w-[60%]`} />
        <span className="mt-1 h-3 w-full rounded-full bg-flame" />
        <div className="mt-auto grid grid-cols-2 gap-1">
          <div className={`${block} aspect-square`} />
          <div className={`${block} aspect-square`} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5">
        <div className="flex gap-1.5">
          {[
            "var(--color-ink)",
            "var(--color-flame)",
            "rgb(20 20 15 / 0.3)",
            "rgb(20 20 15 / 0.12)",
          ].map((c, i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full"
              style={{ background: c, opacity: seed % 3 === 0 && i === 3 ? 0.7 : 1 }}
            />
          ))}
        </div>
        <span className={`${bar} h-2.5 w-[70%]`} />
        <span className={`${bar} h-2 w-[52%]`} />
        <div className="mt-1 space-y-1">
          <span className={`${barSoft} block h-1.5 w-[88%]`} />
          <span className={`${barSoft} block h-1.5 w-[74%]`} />
          <span className={`${barSoft} block h-1.5 w-[60%]`} />
        </div>
        <div className="mt-1 flex gap-1.5">
          <span className="h-3 w-10 rounded-full bg-ink" />
          <span className="h-3 w-8 rounded-full border border-ink/15" />
        </div>
      </div>
    </div>
  );
}
