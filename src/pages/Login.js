import {
    Button,
    Card, LinearProgress,
    Typography,
} from '@material-ui/core';

import LoginRoundedIcon from '@material-ui/icons/LoginRounded';

import { useRef, useState } from 'react';
import PwField from '../components/PwField';

import Shake from 'react-reveal/Shake';

export default function Login(props) {
    const [errState, setErrState] = useState(false),
        [isLoading, setIsLoading] = useState(false),
        [pw, setPw] = useState('');

    const pwFieldRef = useRef();

    // Auto unlock
    props.ss.unlock('Student01').then(r => {
        console.log(r)
        if (r) props.sl(true);
    });

    return <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Card elevation={12} sx={{padding: 2, minWidth: 300}}>
            <Typography variant='h3' mb={.5}>Login</Typography>
            <Typography gutterBottom>to Chatty</Typography>

            <Shake duration={500} count={1} spy={errState}>
                <PwField pw={pw} spw={setPw} sx={{ width: '100%', mt: .5 }} ref={pwFieldRef} />
            </Shake>
            <LinearProgress sx={{mb: 1.5, visibility: isLoading ? 'visible' : 'hidden'}}/>

            <Button variant='contained' sx={{width: '100%'}} endIcon={<LoginRoundedIcon />} disabled={isLoading}
                    onClick={() => {
                        setIsLoading(true)
                        props.ss.unlock(pw).then(r => {
                            setIsLoading(false);
                            if (r) props.sl(true);
                            else {
                                console.log(pwFieldRef.current)
                                setErrState(v => !v);
                            }
                        });
                    }}
            >Login</Button>
        </Card>
    </div>
}