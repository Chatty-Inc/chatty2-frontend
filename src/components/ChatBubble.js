import clsx from 'clsx';
import { memo, useState } from 'react';
import {
    Avatar,
    Badge,
    Box, List,
    ListItem, ListItemIcon,
    ListItemText,
    makeStyles,
    Popover, TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';

// Icons
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import BlockRoundedIcon from '@material-ui/icons/BlockRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import VerifiedUserRoundedIcon from '@material-ui/icons/VerifiedUserRounded';

import Linkify from 'linkifyjs/react';

const useStyles = makeStyles((theme) => ({
    msgBubble: {
        width: 'fit-content',
        maxWidth: '80%',
        padding: `${theme.spacing(.6)} ${theme.spacing(1.4)}`,
        boxShadow: theme.shadows[3],
        overflow: 'hidden',
        '&>p': {
            whiteSpace: 'break-spaces',
            overflowWrap: 'anywhere',
            marginTop: -4,
            fontFamily: '"Source Sans Pro", Poppins, system-ui, sans-serif',
            letterSpacing: '.2px',
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '&>span': {
            fontWeight: 900
        }
    },
    holder: {
        width: '100%',
        padding: `${theme.spacing(.25)} 0`,
        display: 'flex',
        position: 'relative',
    },
    fromOther: {
        backgroundColor: 'rgba(128, 128, 128,.2)',
        borderRadius: '0 12px 12px 12px',
        marginLeft: 72
    },
    fromUsr: {
        backgroundColor: 'rgba(144,202,255,0.2)',
        marginLeft: 'auto',
        marginRight: 72,
        borderRadius: '12px 12px 0 12px',
    },
    usrJoint: {
        borderTopRightRadius: 0
    },
    otherJoint: {
        borderBottomLeftRadius: 0,
    },
    nextJoint: {
        '&>span': { display: 'none' },
        paddingTop: 8,
    },
    noPadding: {
        paddingTop: 0
    },
    first: { paddingTop: theme.spacing(1) },
    last: { paddingBottom: theme.spacing(1) },
}));

function stringAvatar(name) {
    const cols = [
        'primary.light',
        'primary.main',
        'primary.dark',
        'secondary.light',
        'secondary.main',
        'secondary.dark',
    ];

    return {
        sx: {
            bgcolor: cols[Math.floor(Math.random() * cols.length)],
        },
        children: <PersonRoundedIcon />,
    };
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '&:active': {
        transform: 'translateY(2px)'
    }
}));

const UserAvatar = p => {
    const [infoTarget, setInfoTarget] = useState(null),
        infoOpen = Boolean(infoTarget);

    return <>
        <Tooltip title='Online'>
            <StyledBadge sx={{ position: 'absolute', [p.fromUsr ? 'right' : 'left']: 16}}
                         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} overlap='circular'
                         variant='dot' onClick={e => setInfoTarget(e.currentTarget)}>
                <Avatar {...stringAvatar(p.uid)}/>
            </StyledBadge>
        </Tooltip>
        <Popover
            open={infoOpen}
            anchorEl={infoTarget}
            onClose={() => setInfoTarget(null)}
            PaperProps={{
                style: {width: 250, transform: `translateX(${p.fromUsr ? -16 : 16}px)`},
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: p.fromUsr ? 'left' : 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: p.fromUsr ? 'right' : 'left',
            }}>
            <Box sx={{bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                <Tooltip title='Online'>
                    <Badge sx={{m: '16px auto'}} badgeContent=' ' color='success'
                           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} overlap='circular'>
                        <Avatar sx={{width: 80, height: 80}}/>
                    </Badge>
                </Tooltip>

                <Typography align='center'>{p.uid}</Typography>
                <Typography align='center' variant='subtitle2' color='text.secondary' gutterBottom>User status goes here</Typography>
            </Box>
            <TextField label='Note' variant='filled' sx={{m: 1, width: 'calc(100% - 16px)'}}/>
            <List sx={{p: 0}} dense>
                <ListItem button>
                    <ListItemIcon><PersonRoundedIcon /></ListItemIcon>
                    <ListItemText>View Profile</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><EditRoundedIcon /></ListItemIcon>
                    <ListItemText>Edit Info</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><VerifiedUserRoundedIcon /></ListItemIcon>
                    <ListItemText>Verify Signing Key</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><BlockRoundedIcon /></ListItemIcon>
                    <ListItemText>Block</ListItemText>
                </ListItem>
            </List>
        </Popover>
    </>
}


function ChatBubble(p) {
    console.log(p);
    const classes = useStyles();

    const { msg, uid, userUID, prevJoint, nextJoint, first, last } = p;
    const fromUsr = uid === userUID
    return <div className={clsx(classes.holder,
        {
            [classes.noPadding]: nextJoint,
            [classes.first]: first,
            [classes.last]: last,
        })}>
        <div className={clsx(classes.msgBubble, {
            [classes.usrJoint]: fromUsr && nextJoint,
            [classes.otherJoint]: !fromUsr && prevJoint,
            [classes.fromUsr]: fromUsr,
            [classes.fromOther]: !fromUsr,
            [classes.nextJoint]: nextJoint,
        })}>
            <Typography variant='caption' color='text.secondary'>{uid}</Typography>
            <Typography><Linkify options={{defaultProtocol: 'https', target: {url: '_blank'}}}>{msg}</Linkify></Typography>
        </div>

        { !nextJoint && <UserAvatar uid={uid} fromUsr={fromUsr}/> }
    </div>
}

export default memo(ChatBubble)