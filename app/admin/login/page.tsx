import { LoginForm } from "@/components/admin/LoginForm";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export default async function LoginPage() {
  const messages = getDictionary(await getLocale());
  return <LoginForm messages={messages} />;
}
