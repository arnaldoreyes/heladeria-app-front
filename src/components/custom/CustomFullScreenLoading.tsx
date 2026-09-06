import { useTranslation } from "react-i18next";

export const CustomFullScreenLoading = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-lg font-medium">{t("common.pleaseWait")}</p>
      </div>
    </div>
  );
};
