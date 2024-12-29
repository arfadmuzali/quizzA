import BaseLayout from "@/components/layouts/BaseLayout";
import NotFound from "@/components/layouts/NotFound";
import { routing } from "@/i18n/routing";

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFound />
    </BaseLayout>
  );
}
