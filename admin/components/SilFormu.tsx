"use client";

import { Icon } from "./Icon";
import { KaydetDugmesi } from "./KaydetDugmesi";

export function SilFormu({
  eylem,
  onay,
  gizli,
  etiket = "Sil",
}: {
  eylem: (fd: FormData) => void | Promise<void>;
  onay: string;
  /** Eyleme gidecek gizli alanlar (ör. { slug }) */
  gizli: Record<string, string>;
  etiket?: string;
}) {
  return (
    <form
      action={eylem}
      onSubmit={(e) => {
        if (!window.confirm(onay)) e.preventDefault();
      }}
    >
      {Object.entries(gizli).map(([ad, deger]) => (
        <input key={ad} type="hidden" name={ad} value={deger} />
      ))}
      <KaydetDugmesi tur="tehlike" bekleme="…">
        <Icon name="trash" className="h-4 w-4" />
        {etiket ? etiket : <span className="sr-only">Sil</span>}
      </KaydetDugmesi>
    </form>
  );
}
