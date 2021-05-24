import clsx from 'clsx';
import { memo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    msgBubble: {
        margin: `${theme.spacing(.5)} 0`,
        width: 'fit-content',
        maxWidth: '80%',
        padding: `${theme.spacing(.5)} ${theme.spacing(1.25)}`,
        '&>p': {
            whiteSpace: 'break-spaces',
            overflowWrap: 'anywhere',
            marginTop: -4
        },
        '&>span': {
            fontWeight: 900
        }
    },
    fromOther: {
        backgroundColor: 'rgba(128, 128, 128,.3)',
        borderRadius: '0 12px 12px 12px',
    },
    fromUsr: {
        backgroundColor: 'rgba(169,209,255,.3)',
        marginLeft: 'auto',
        borderRadius: '12px 12px 0 12px',
    },
    usrJoint: {
        '&+div': { borderTopRightRadius: 0 },
    },
    otherJoint: {
        borderBottomLeftRadius: 0,
    },
    joint: {
        '&+div': {
            '&>p': { margin: 0 },
            '&>span': { display: 'none' },
            marginTop: 2
        },
        marginBottom: 2
    }
}))

function ChatBubble(p) {
    const classes = useStyles();

    const { msg, uid, userUID, joined } = p;
    const fromUsr = uid === userUID
    return <div className={clsx(classes.msgBubble, {
        [classes.usrJoint]: joined && fromUsr,
        [classes.otherJoint]: joined && !fromUsr,
        [classes.fromUsr]: fromUsr,
        [classes.fromOther]: !fromUsr,
        [classes.joint]: joined,
    })}>
        <Typography variant='caption'>{uid}</Typography>
        <Typography>{msg}</Typography>
    </div>
}

export default memo(ChatBubble);