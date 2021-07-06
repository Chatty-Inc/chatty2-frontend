import './css/App.css';

import themeOptions from './lib/themeOptions';
import { useEffect, useState } from 'react';

import SecureStorage from './lib/secureStorage';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Main from './pages/Main';
import Login from './pages/Login';
import OnBoarding from './pages/Onboarding';
import Loading from './components/Loading';

// Fonts
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import MainErrorBoundary from './components/MainErrorBoundary';
// import '@fontsource/source-sans-pro/400.css';

const ss = new SecureStorage();

function App() {
    const [loggedIn, setLoggedIn] = useState(false),
        [hasInit, setHasInit] = useState(false),
        [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const init = await ss.isInit();
            setHasInit(init);
            setLoading(false);
        })()
    }, [hasInit])

    return (
        <>
            <ThemeProvider theme={themeOptions('dark')}>
                <CssBaseline/>
                <MainErrorBoundary>
                    { loading ? <Loading />
                        : hasInit
                            ? (loggedIn ? <Main ss={ss}/> : <Login sl={setLoggedIn} ss={ss} />)
                            : <OnBoarding ss={ss}/>
                    }
                </MainErrorBoundary>
            </ThemeProvider>
        </>
    );
}

export default App;
