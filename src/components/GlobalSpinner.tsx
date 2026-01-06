import { useAppSelector } from '../store/hooks';

const GlobalSpinner = () => {
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Carregando...</p>
      </div>
    </div>
  );
};

export default GlobalSpinner;
