import {
    Box,
    Button,
    ButtonBase,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';

export default function ScreenShare({o, so}) {
    const previewVidRef = useRef(),
    [hasSelected, setHasSelected] = useState(false);

    useEffect(() => {
        // Stop streaming
        setHasSelected(false);
        if (!previewVidRef.current?.srcObject) return;
        const tracks = previewVidRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        previewVidRef.current.srcObject = null;
    }, [o]);

    return <Dialog open={o} fullWidth={true} maxWidth='sm' onClose={() => so(false)}>
        <DialogTitle>Share your screen</DialogTitle>
        <DialogContent sx={{pb: .5}}>
            <ButtonBase sx={{borderRadius: '7px', width: '100%', position: 'relative', overflow: 'hidden'}} onClick={() => {
                navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'always'
                    },
                    audio: false
                }).then(v => {
                    previewVidRef.current.srcObject = v;
                    previewVidRef.current.play();
                    setHasSelected(true);
                });
            }}>
                <Box top={0} right={0} bottom={0} left={0} position='absolute' flexDirection='column' p={2}
                     display='flex' justifyContent='center' alignItems='center'
                     sx={{transition: 'opacity .2s ease-in-out, background-color .2s ease-in-out', opacity: hasSelected ? 0 : 1, zIndex: 10,
                         '&:hover': {opacity: 1, backgroundColor: '#00000055'}}}>
                    <Typography variant='h5'>Select a screen to share</Typography>
                </Box>
                <video style={!hasSelected ? {height: 0, paddingTop: '56.25%', width: '100%'} : {width: '100%'}} ref={previewVidRef} />
            </ButtonBase>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => so(false)}>Back</Button>
            <div style={{flexGrow: 1}} />
            <Button variant='contained'>Start streaming</Button>
        </DialogActions>
    </Dialog>
}
