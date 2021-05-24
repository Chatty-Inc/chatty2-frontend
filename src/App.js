import themeOptions from './lib/themeOptions';
import { useEffect, useState } from 'react';

import SecureStorage from './lib/secureStorage';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Main from './pages/Main';
import Login from './pages/Login';
import OnBoarding from './pages/Onboarding';
import Loading from './components/Loading';

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
                { loading ? <Loading />
                    : hasInit
                        ? (loggedIn ? <Main ss={ss}/> : <Login sl={setLoggedIn} ss={ss} />)
                        : <OnBoarding ss={ss}/>
                }
            </ThemeProvider>
        </>
    );
}

export default App;
