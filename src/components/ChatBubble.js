import clsx from 'clsx';
import { memo, useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import {
    Alert,
    Avatar,
    Badge,
    Box, Button, ButtonBase, Chip, Dialog, DialogActions, DialogContent, Divider, IconButton, List,
    ListItem, ListItemIcon,
    ListItemText,
    Popover, TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';

// Icons
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

import Linkify from 'linkifyjs/react';
import { AddRounded, DeleteForeverRounded, DownloadRounded } from '@material-ui/icons';
import SitePreviewCard from './SitePreviewCard';

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
            fontFamily: '"IBM Plex Sans", Poppins, system-ui, sans-serif',
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

const dummyRoles = [
    {name: 'Owner', color: '#fbc02d'},
    {name: 'Wang', color: '#1e88e5'},
    {name: 'Lol', color: '#ef5350'},
    {name: 'Testers', color: '#ab47bc'},
    {name: 'Die-no', color: '#4caf50'},
    {name: 'A very long role that will be truncated', color: '#26a69a'},
    {name: 'Lower roles have less priority', color: '#78909c'},
]

const ChipItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(.25),
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
                sx: {width: 300, transform: `translateX(${p.fromUsr ? -16 : 16}px)`, position: 'relative', backgroundImage: 'none'},
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: p.fromUsr ? 'left' : 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: p.fromUsr ? 'right' : 'left',
            }}>
            <Box sx={{bgcolor: 'primary.main', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 60, width: 'inherit'}} />

            <Tooltip title='Online'>
                <Badge sx={{position: 'absolute', top: 16, left: 16, borderRadius: '50%',
                    border: t => `6px solid ${t.palette.background.default}`,
                    '& > span.MuiBadge-badge': {border: t => `6px solid ${t.palette.background.default}`,
                        width: 28, height: 28, borderRadius: '50%'}}} badgeContent=' ' color='success'
                       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} overlap='circular'>
                    <Avatar sx={{width: 80, height: 80}}/>
                </Badge>
            </Tooltip>

            <Typography align='center' p='64px 16px 0' fontWeight={700}>{p.uid}</Typography>
            <Typography align='center' variant='subtitle2' color='text.secondary' gutterBottom>User status goes here</Typography>

            <Divider />
            <Typography variant='overline' fontWeight={700} mx={2}>Roles</Typography>
            <ul style={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                padding: 8,
                paddingTop: 0,
                margin: 0,
            }}>
                {
                    dummyRoles.map(r => {
                        return <ChipItem key={r.name}>
                            <Chip
                                variant="outlined"
                                sx={{'& span.MuiChip-label': {textOverflow: 'ellipsis', maxWidth: 80}, borderColor: r.color}}
                                size='small'
                                label={r.name}
                                onDelete={() => {}}
                            />
                        </ChipItem>
                    })
                }
                <ChipItem>
                    <div style={{width: 24, height: 24, borderRadius: '50%', border: '1px solid #616161', marginTop: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                        <AddRounded sx={{width: 20, height: 20}} />
                    </div>
                </ChipItem>
            </ul>
            <Divider />

            <TextField label='Note' variant='filled' sx={{m: 1, width: 'calc(100% - 16px)'}}/>

            <Divider />
            <List sx={{p: 0}} dense>
                <ListItem button>
                    <ListItemIcon><AddRounded /></ListItemIcon>
                    <ListItemText>Create Chat</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><PersonRoundedIcon /></ListItemIcon>
                    <ListItemText>View Profile</ListItemText>
                </ListItem>
            </List>
        </Popover>
    </>
}


const ChatBubble = memo(({ msg, uid, userUID, prevJoint, nextJoint, first, last, grpTitle, purpose, sb }) => {
    const classes = useStyles();

    const [mediaDialogOpen, setMediaDialogOpen] = useState(false),
    [links, setLinks] = useState([]);

    const fromUsr = uid === userUID
    return <>
        <Dialog open={mediaDialogOpen} onClose={() => setMediaDialogOpen(false)}>
            <DialogContent sx={{paddingBottom: 0}}>
                <img src={msg} alt='' style={{maxWidth: '100%', minWidth: '100px', borderRadius: 7}} draggable={false} />
                <Typography maxWidth='fit-content' variant='subtitle2'>
                    Image Caption
                </Typography>
            </DialogContent>
            <DialogActions sx={{pt: 0}}>
                <Button onClick={() => setMediaDialogOpen(false)}>Close</Button>
                <div style={{flexGrow: 1}} />
                <Tooltip title='Download Media'>
                    <IconButton href={msg} download={`Media from ${grpTitle}`}>
                        <DownloadRounded />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete locally stored image'>
                    <IconButton>
                        <DeleteForeverRounded />
                    </IconButton>
                </Tooltip>
            </DialogActions>
        </Dialog>
        {
            first && <div style={{padding: '.5rem 1rem'}}>
                <Avatar sx={{width: 96, height: 96, mt: 1}} />
                <Typography variant='h3' my={1} fontWeight={700} fontSize={36}>{grpTitle}</Typography>
                <Typography color='text.secondary' gutterBottom>This is the start of the {grpTitle} chat.</Typography>
                <Divider />
            </div>
        }
        <div className={clsx(classes.holder,
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
            })}><Typography variant='caption' color='text.secondary'>{uid}</Typography>
                {
                    purpose === 'img' &&
                    <ButtonBase sx={{borderRadius: theme => theme.shape.borderRadius + 'px', width: '-webkit-fill-available',
                         overflow: 'hidden', mt: '2px', display: 'flex', maxWidth: '100%'}}
                                onClick={() => setMediaDialogOpen(true)}>
                        <img src={msg} alt='' style={{width: '100%', minWidth: 50, maxWidth: 600}} draggable={false} />
                    </ButtonBase>
                }
                {
                    (purpose === 'txt' || purpose === 'img') &&
                    <Typography mt={purpose === 'img' ? '0!important' : 'inherit'}>
                        <Linkify options={{defaultProtocol: 'https', target: {url: '_blank'}, formatHref: (href, type) =>
                            {
                                setLinks(v => v.includes(href) ? v : [...v, href]);
                                return href;
                            }
                        }}>
                            {purpose === 'img' ? 'Image caption' : msg}
                        </Linkify>
                    </Typography>
                }

                {
                    purpose === 'err' && <Alert severity='error' variant='outlined' sx={{mb: '5px', mt: .2}}>{msg}</Alert>
                }

                {
                    links.map(link => <SitePreviewCard url={link} key={link} sb={sb} />)
                }
            </div>

            { !nextJoint && <UserAvatar uid={uid} fromUsr={fromUsr}/> }
        </div>
    </>
})

export default ChatBubble;
