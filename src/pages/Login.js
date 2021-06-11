import {
    Button,
    Card, LinearProgress, makeStyles,
    Typography,
} from '@material-ui/core';

import LoginRoundedIcon from '@material-ui/icons/LoginRounded';

import { useRef, useState } from 'react';
import PwField from '../components/PwField';

import Shake from 'react-reveal/Shake';
import clsx from 'clsx';

const generateTextShadow = count => {
    const shadows = []
    for (let i = 0; i < count; i++) {
        shadows.push(`${(-.5 + Math.random()) * 3}em ${(-.5 + Math.random()) * 3}em 8px hsla(${Math.random() * 360},100%,50%,.9)`);
    }
    return shadows.join(',');
}

const NUM_DOTS = 100;

const useStyles = makeStyles((theme) => ({
    container: {
        font: '5vmin/1.3 Serif',
        overflow: 'hidden',
        background: '#123',
        '&, &>div': {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }
    },
    holders: {
        display: 'block',
        fontSize: 52,
        color: 'transparent',
        '&::before, &::after': {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '3em',
            height: '3em',
            content: '"."',
            mixBlendMode: 'screen',
            animation: '56s -44s $move infinite ease-in-out alternate',
        },
    },
    holderA: {
        '&::before': {
            textShadow: generateTextShadow(NUM_DOTS),
            animationDuration: '108s',
            animationDelay: '-72s',
        },
        '&::after': {
            textShadow: generateTextShadow(NUM_DOTS),
            animationDuration: '102s',
            animationDelay: '-58.5s',
        }
    },
    holderB: {
        '&::before': {
            textShadow: generateTextShadow(NUM_DOTS),
            animationDuration: '96s',
            animationDelay: '-54s',
        },
        '&::after': {
            textShadow: generateTextShadow(NUM_DOTS),
            animationDuration: '84s',
            animationDelay: '-63s',
        }
    },
    '@keyframes move': {
        'from': {
            transform: 'rotate(0deg) scale(12) translateX(-20px)',
        },
        'to': {
            transform: 'rotate(360deg) scale(18) translateX(20px)',
        }
    }
}));

export default function Login(props) {
    const [errState, setErrState] = useState(false),
        [isLoading, setIsLoading] = useState(false),
        [pw, setPw] = useState('');

    const pwFieldRef = useRef();

    const classes = useStyles();

    // Auto unlock
    /*props.ss.unlock('Student01').then(r => {
        console.log(r)
        if (r) props.sl(true);
    });*/

    return <>
        <div className={classes.container}>
            <div className={clsx([classes.holders, classes.holderA])} />
            <div className={clsx([classes.holders, classes.holderB])} />
        </div>
        <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'absolute', left: 0, top: 0, zIndex: 2, width: '100%'}}>
            <Card elevation={12} sx={{padding: 2, minWidth: 300, backgroundColor: 'transparent',
                backdropFilter: 'brightness(.3) saturate(2)'}}>
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
    </>
}