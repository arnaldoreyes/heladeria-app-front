import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  let errorMessage = t('errors.unexpected');
  let errorStatus = t('errors.oops');

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status}`;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{errorStatus}</h1>
        <p className="text-lg font-medium text-gray-800 mb-2">{t('errors.somethingWentWrong')}</p>
        <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('common.reload')}
          </button>
          <Link
            to="/pos"
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {t('common.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}