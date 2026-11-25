import { cikisYap } from "@/app/giris/eylemler";
import { Icon } from "./Icon";

export function CikisDugmesi() {
  return (
    <form action={cikisYap}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-ink"
      >
        <Icon name="logout" className="h-4 w-4" />
        Çıkış
      </button>
    </form>
  );
}
