import { whatsappLink } from "@/lib/site";
import { Icon } from "./Icon";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(
        "Merhaba, web sitesi / yazılım projem için bilgi almak istiyorum."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed right-4 bottom-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
