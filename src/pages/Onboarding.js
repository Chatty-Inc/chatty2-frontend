import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    Typography
} from '@material-ui/core';

import {v4 as uuid} from 'uuid';

import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

import { useEffect, useState } from 'react';
import PwField from '../components/PwField';

const genKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 4096, //can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: 'SHA-512'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['encrypt', 'decrypt'] //must be ['encrypt', 'decrypt'] or ['wrapKey', 'unwrapKey']
    );

    const expPubKey = await window.crypto.subtle.exportKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        keyPair.publicKey // can be a publicKey or privateKey, as long as extractable was true
    );
    const expPriKey = await window.crypto.subtle.exportKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        keyPair.privateKey // can be a publicKey or privateKey, as long as extractable was true
    );

    return { pub: expPubKey, pri: expPriKey };
}

const genSignKeys = async () => {
    const signKey = await window.crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-521', //can be "P-256", "P-384", or "P-521"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['sign', 'verify'] //can be any combination of "sign" and "verify"
    );

    const expPubKey = await window.crypto.subtle.exportKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        signKey.publicKey // can be a publicKey or privateKey, as long as extractable was true
    );
    const expPriKey = await window.crypto.subtle.exportKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        signKey.privateKey // can be a publicKey or privateKey, as long as extractable was true
    );

    return { signPri: expPriKey, signPub: expPubKey };
}

export default function OnBoarding(props) {
    const {ss} = props;

    const [loadLabel, setLoadLabel] = useState(null),
        [keys, setKeys] = useState({}),
        [signKeys, setSignKeys] = useState({}),
        [pw, setPw] = useState(''),
        [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        (async () => {
            setLoadLabel('Generating keypair')
            setKeys(await genKeys());

            setLoadLabel('Generating signing keys');
            setSignKeys(await genSignKeys());
            setLoadLabel(null);
        })();

    }, [])

    return (
        <>
            <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Typography variant='h3' gutterBottom>Welcome to Chatty</Typography>
                    <Button size='large' variant='contained' endIcon={<ArrowForwardRoundedIcon />} onClick={() => setDialogOpen(true)}>
                        Get started
                    </Button>
                </div>
            </div>

            <div style={{position: 'fixed', bottom: 0, right: 0, padding: 8, display: 'flex', alignItems: 'center'}}>
                {
                    loadLabel
                        ? <>
                            <Typography variant='subtitle1' color='text.secondary'>{loadLabel}</Typography>
                            <CircularProgress size={30} sx={{ml: 1}}/>
                        </>
                        : <Tooltip title='No tasks running'><CheckRoundedIcon /></Tooltip>
                }
            </div>

            <Dialog open={dialogOpen}

                    onClose={() => setDialogOpen(false)}
                    maxWidth='xs'
                    fullWidth
                    aria-labelledby='ob-d-t'>
                <DialogTitle id='ob-d-t'>Setup</DialogTitle>
                <DialogContent sx={{py: 0}}>
                    <div>
                        <Typography component='span' color='text.secondary'>
                            Enter a password that will be used to encrypt local chat data
                        </Typography>

                        <PwField pw={pw} spw={setPw} sx={{ width: '100%', mt: 1 }} />

                        <Typography variant='subtitle2' component='small' pt={.5} color='text.secondary'>
                            Please remember this password - It cannot be recovered if lost
                        </Typography>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        setDialogOpen(false);

                        setLoadLabel('Initialising datastore');
                        await ss.init(pw);

                        setLoadLabel('Saving keypair');
                        // await ss.setVal('priKey', keys.pri);
                        // await ss.setVal('pubKey', keys.pub);
                        await ss.setDoc('keys', 'priEnc', keys.pri);
                        await ss.setDoc('keys', 'pubEnc', keys.pub);

                        setLoadLabel('Saving signing keys');
                        // await ss.setVal('signPub', signKeys.signPub);
                        // await ss.setVal('signPri', signKeys.signPri);
                        await ss.setDoc('keys', 'pubSign', signKeys.signPub);
                        await ss.setDoc('keys', 'priSign', signKeys.signPri);

                        setLoadLabel('Generating UID');
                        // await ss.setVal('uid', uuid());
                        await ss.setDoc('uData', 'uid', uuid());

                        setLoadLabel('Reloading...');
                        document.location.reload();
                    }} variant='contained' sx={{width: '100%', }}>Done</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}