import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/routes';
import { useAuthStore } from '@/stores';

function App() {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;
