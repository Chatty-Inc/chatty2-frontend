import { Component } from 'react';

import { ErrorRounded } from '@material-ui/icons';
import { Button, Typography } from '@material-ui/core';

export default class MainErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div style={{display: 'flex', width: '100%', minHeight: '100vh',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <ErrorRounded fontSize='inherit' sx={{fontSize: '8em', mb: 1}} />
                <Typography variant='h2' gutterBottom>Oops</Typography>
                <Typography my={1}>
                    It looks like we have encountered a fatal error, and halted the app to prevent any damage or loss of data.<br/>
                </Typography>
                <Button variant='outlined'>Reload</Button>
            </div>
        }

        return this.props.children;
    }
}
