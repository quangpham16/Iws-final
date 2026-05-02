import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-12 max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={36} className="text-rose-500" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                            {this.state.error?.message || 'An unexpected error occurred in the application.'}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] transition-all shadow-lg shadow-[#106E4E]/20"
                        >
                            <RefreshCcw size={16} />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
