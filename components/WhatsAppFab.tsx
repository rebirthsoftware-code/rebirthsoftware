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
      className="pulse-ring fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-flame text-white transition duration-300 hover:scale-105 hover:bg-flame-soft sm:right-8 sm:bottom-8"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
