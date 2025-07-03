import "@/i18n";
import i18n from "@/i18n";
import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <Stack screenOptions={{ headerShown: false }} />
    </I18nextProvider>
  );
}
