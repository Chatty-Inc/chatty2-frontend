import { CircularProgress, Typography } from '@material-ui/core';

export default function Loading() {
    return <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <CircularProgress />
        <Typography mt={1}>Loading</Typography>
    </div>
}