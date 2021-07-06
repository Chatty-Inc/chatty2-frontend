import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export default function ScreenShare({o, so}) {
    return <Dialog open={o} fullWidth={true} maxWidth='xs' onClose={() => so(false)}>
        <DialogTitle>Share your screen</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
            <Button onClick={() => so(false)}>Back</Button>
            <div style={{flexGrow: 1}} />
            <Button variant='contained'>Start streaming</Button>
        </DialogActions>
    </Dialog>
}
