import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Anda juga dapat mengirim log error ke layanan pelaporan error
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Anda dapat merender UI fallback kustom apa pun
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Terjadi Kesalahan</h1>
            <p className="text-gray-700 mb-4">
              Maaf, terjadi kesalahan yang tidak terduga pada bagian aplikasi ini. Tim kami telah diberitahu.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Silakan coba segarkan halaman ini. Jika masalah berlanjut, hubungi dukungan teknis.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Segarkan Halaman
            </button>
            {this.state.error && (
              <details className="mt-6 text-left text-xs text-gray-500">
                <summary className="cursor-pointer">Detail Error Teknis</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded-md whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
