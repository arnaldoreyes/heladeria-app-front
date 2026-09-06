import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-wider">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">{t('errors.notFoundTitle')}</h2>
        <p className="text-gray-600 mt-2">
          {t('errors.notFoundDescription')}
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}