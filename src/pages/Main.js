import { useEffect, useRef, useState } from 'react';
import {v4 as uuid} from 'uuid';

// MUI
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Card,
    makeStyles,
    TextField,
    ListItemAvatar,
    ListItem,
    Avatar,
    ListItemText,
    Divider,
    ListItemIcon,
    ListItemSecondaryAction,
    Tooltip,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
} from '@material-ui/core';

// Icons
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import ImageIcon from '@material-ui/icons/Image';

import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ContentCopyRoundedIcon from '@material-ui/icons/ContentCopyRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DriveFileRenameOutlineRoundedIcon from '@material-ui/icons/DriveFileRenameOutlineRounded';
import appIcon from '../img/icon.svg';
import VerifiedUserRoundedIcon from '@material-ui/icons/VerifiedUserRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';

// Components
import ChatsList from '../components/ChatsList';
import MsgInput from '../components/MsgInput';
import NoChatPlaceholder from '../components/NoChatPlaceholder';
import MsgHistory from '../components/MsgHistory';

// Hashing utilities
import getHexHash from '../lib/crypto/getHexHash';

// Message utilities
import receiveMsg from '../lib/msg/receiveMsg';
import sendMsg from '../lib/msg/sendMsg';
import { useIsMount } from '../hooks/useIsMount';
import ChatSettings from '../components/ChatSettings';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: 'calc(100vh - 64px)',
        padding: theme.spacing(2),
        display: 'grid',
        gridTemplateColumns: '350px auto',
        gridGap: theme.spacing(1.5),
    },
    code: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid rgba(128, 128, 128, .5)',
        borderRadius: theme.shape.borderRadius,
        padding: `${theme.spacing(.3)} ${theme.spacing(.5)}`,
        margin: `${theme.spacing(.5)} ${theme.spacing(.4)}`,
        display: 'block',
        fontFamily: 'Courier'
    }
}));

let chatData = {};
let usrUID = '';
let signPubKeys = {};

export default function Main(props) {
    const classes = useStyles();

    const { ss } = props;

    // UI constants
    const conStates = [
        {col: '#808080', label: 'Connecting...'},
        {col: '#ff0000', label: 'Error'},
        {col: '#00ff00', label: 'Connected'},
        {col: '#ff8000', label: 'Disconnected'},
    ];

    const
        [curGid, setCurGid] = useState(null),
        [menuAnchor, setMenuAnchor] = useState(null),
        [uMenuAnchor, setUMenuAnchor] = useState(null),
        [chatList, setChatList] = useState({}),
        [snackbar, setSnackbar] = useState({open: false, msg: '', type: 'success'}),
        [conState, setConState] = useState(0),
        [query, setQuery] = useState(''),
        [chats, setChats] = useState([]),
        [addDialogOpen, setAddDialogOpen] = useState(false),
        [delDialogOpen, setDelDialogOpen] = useState(false),
        [changeTitleOpen, setChangeTitleOpen] = useState(false),
        [msg, setMsg] = useState(''),
        [signVerifyData, setSignVerifyData] = useState({open: false}),
        [newTitle, setNewTitle] = useState(''),
        [diff, setDiff] = useState(0),
        [addVal, setAddVal] = useState({name: '', gid: ''}),
        [chatSettingOpen, setChatSettingOpen] = useState(false),
        [cSettingData, setCSettingData] = useState({}),
        pubKeys = useRef({}),
        keys = useRef({}),
        signKeys = useRef({}),
        ws = useRef(),
        msgScroller = useRef(),
        awaitingSend = useRef({}),
        signKeyAct = useRef({}),
        usrMenuOpen = Boolean(uMenuAnchor),
        menuOpen = Boolean(menuAnchor);

    const isMt = useIsMount();

    const syncData = (noCopy = false) => {
        if (!noCopy) chatData[curGid] = chats;
        ss.setVal('chatData', JSON.stringify(chatData)).then();
    }
    const syncSignKeys = () => {
        ss.setVal('signKeys', signPubKeys).then();
    }

    const verifySignKey = async (uid, p) => {
        setSignVerifyData({uid: uid, key: p, hash: await getHexHash(p), open: true, mode: 0});
    }

    const requestSignKey = async uid => {
        if (signPubKeys[uid]) return;
        await send(JSON.stringify({
            act: 'getSignPub',
            target: uid
        }));
    }

    useEffect(() => {
        //if (Object.keys(chatList).length === 0) return;
        if (isMt) return;
        console.log('here')
        ss.setVal('chats', JSON.stringify(chatList)).then();
    }, [chatList]);
    useEffect(() => {
        if (chats.length === 0) return;
        if (Object.keys(chatData).length === 0) return;
        syncData();
    }, [chats]);
    useEffect(() => {
        const nc = chatData[curGid] ?? [];
        setChats(() => {
            setTimeout(() => {
                msgScroller.current?.scrollToIndex({
                    index: nc.length,
                    align: 'bottom',
                    behavior: 'auto'
                });
                console.log('scrolling', nc.length);
            }, 10);
            return nc;
        });
    }, [curGid]);

    // WebSocket utility functions
    const send = async m => {
        if (!ws || ws.current.readyState !== 1) return false;
        await ws.current.send(m)
    }
    const connect = () => {
        ws.current = null;
        ws.current = new WebSocket('wss://api.chattyapp.cf');

        let int = null
        let lastTime = +new Date();

        const ping = async () => {
            await send(JSON.stringify({
                act: 'ping'
            }));
            lastTime = +new Date();
        }

        ws.current.onopen = async () => {
            if (conState === 2) return;
            setConState(2);
            await send(JSON.stringify({
                uid: usrUID
            }));
            await send(JSON.stringify({
                act: 'updatePub',
                key: keys.current.pub
            }));
            await send(JSON.stringify({
                act: 'updateSign',
                key: signKeys.current.pubSign
            }));

            await ping();
            int = setInterval(ping, 3000)
        }

        ws.current.onmessage = msg => {
            let d;
            try {
                d = JSON.parse(msg.data);
            } catch {
                return;
            }

            console.log(d);

            switch (d.resp) {
                case 'pong':
                    setDiff(new Date() - lastTime);
                    break;
                case 'txtMsg':
                    const act = () => {
                        receiveMsg(d, keys, signPubKeys).then(m => {
                            const o = { msg: m, uid: d.uid }
                            let oldV = null
                            setCurGid(v => {
                                oldV = v;
                                return v
                            });
                            if (!chatData[d.gid]) chatData[d.gid] = [];
                            if (d.gid === oldV) setChats(ov => [...ov, o]);
                            else chatData[d.gid].push(o);
                            console.log(o);
                        });
                    }
                    // Silly workaround to access the latest value of a state in a event handler
                    let once = true;
                    setChatList(ov => {
                        if (!once) return;
                        once = false;

                        if (ov[d.gid]) {
                            act();
                            return ov;
                        }
                        if (signPubKeys[d.uid]) act();
                        else {
                            requestSignKey(d.uid).then();
                            signKeyAct.current = {uid: d.uid, act: act};
                        }

                        return {...ov, [d.gid]: {
                            name: 'Unknown chat', people: [d.uid]
                        }}
                    });
                    break;
                case 'pubKey':
                    pubKeys.current = {
                        ...pubKeys.current,
                        [d.uid]: d.pub
                    }
                    if (awaitingSend.current && awaitingSend.current[d.uid]) {
                        awaitingSend.current[d.uid](d.pub);
                        delete awaitingSend.current[d.uid];
                    }
                    break;
                case 'signKey':
                    if (!signPubKeys) signPubKeys = {};
                    if (signPubKeys[d.uid]) return;
                    verifySignKey(d.uid, d.pub).then();
                    break;
                default:
                    break;
            }
        }

        ws.current.onclose = () => {
            setConState(3);
            clearInterval(int);

            setTimeout(connect, 5000);
        }

        ws.current.onerror = () => {
            setConState(1);
            // setTimeout(connect, 5000);
        }
    }

    useEffect(() => {
        (async () => {
            const pub = await ss.getVal('pubKey');
            const pri = await ss.getVal('priKey');
            keys.current = {pub, pri};

            const pubSign = await ss.getVal('signPub');
            const priSign = await ss.getVal('signPri');
            signKeys.current = {pubSign, priSign};
            console.log(signKeys.current);

            signPubKeys = await ss.getVal('signKeys');
            console.log(signPubKeys);

            usrUID = await ss.getVal('uid');

            const c = await ss.getVal('chats');
            setChatList(c ? JSON.parse(c) : {});
            const cData = await ss.getVal('chatData');
            chatData = cData ? JSON.parse(cData) : {}

            connect();
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _handleSend = () => {
        const tm = msg.trim();
        if (tm.length !== 0) {
            setChats([...chats, {
                msg: tm,
                uid: usrUID
            }]);
            setMsg('');

            chatList[curGid].people.forEach(member => {
                sendMsg(curGid, member, msg, signKeys, pubKeys, awaitingSend, send).then(() => console.log('Sent to', member));
            });
        }
    }
    const _handleAddClose = () => {
        setAddDialogOpen(false);
        setAddVal({name: '', gid: ''});
    }
    const _handleDelClose = () => setDelDialogOpen(false);
    const _handleMenuClose = () => setMenuAnchor(null);
    const _handleUMenuClose = () => setUMenuAnchor(null);
    const _handleChangeTitleClose = () => setChangeTitleOpen(false);

    return (
        <>
            <div style={{minHeight: '100vh'}}>
                <AppBar position='relative'>
                    <Toolbar>
                        <img src={appIcon} width={32} height={32} alt='' />
                        <Typography variant='h6' component='div' sx={{flexGrow: 1, ml: 2.5}}>
                            Chatty
                        </Typography>
                        <Card sx={{padding: '4px 12px', display: 'flex', alignItems: 'center'}} elevation={4}>
                            <div style={{
                                width: 10, height: 10, borderRadius: '50%', marginRight: '8px',
                                backgroundColor: conStates[conState].col
                            }}/>
                            <Typography variant='subtitle1'>{conStates[conState].label} • RT: {diff}ms</Typography>
                        </Card>
                        <IconButton edge='end' color='inherit' aria-label='lock' sx={{ml: 1.5}}
                                    onClick={() => {

                                    }}>
                            <LockRoundedIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <div className={classes.container}>
                    <Card sx={{
                        width: 350,
                        display: 'grid',
                        gridTemplateRows: 'auto 1fr auto',
                        maxHeight: 'calc(100vh - 98px)'
                    }}
                          elevation={6}>
                        <div style={{display: 'flex', alignItems: 'center', width: '100%', padding: '10px'}}>
                            <TextField variant='outlined' label='Search' value={query}
                                       onChange={e => setQuery(e.target.value)} sx={{flexGrow: 1, mr: 1}}/>
                            <Fab color='secondary' aria-label='add' size='medium'
                                 onClick={() => setAddDialogOpen(true)}>
                                <AddRoundedIcon/>
                            </Fab>
                        </div>

                        <ChatsList cl={chatList} sg={setCurGid} cg={curGid} q={query} pk={signPubKeys} />

                        <Divider/>
                        <ListItem button ContainerComponent='div' id='u-acc-btn' onClick={e => setUMenuAnchor(e.currentTarget)}>
                            <ListItemIcon><AccountCircleRoundedIcon/></ListItemIcon>
                            <ListItemText primary='Your Account'/>
                            <ListItemSecondaryAction>
                                <Tooltip title='Copy your UID'>
                                    <IconButton edge='end' aria-label='' sx={{mr: 0.0001}} onClick={() => {
                                        navigator.clipboard.writeText(usrUID).then(() =>
                                            setSnackbar({open: true, msg: 'Copied UID!', type: 'success'}))
                                    }}>
                                        <ContentCopyRoundedIcon/>
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>

                        <Menu
                            id='u-acct-menu'
                            aria-labelledby='u-acc-btn'
                            anchorEl={uMenuAnchor}
                            open={usrMenuOpen}
                            onClose={_handleUMenuClose}
                            sx={{'& .MuiSvgIcon-root': { color: 'text.secondary', marginRight: 1.5 }}}
                            PaperProps={{ style: { minWidth: 300 } }}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                            <MenuItem onClick={_handleUMenuClose}><PersonRoundedIcon /> Profile</MenuItem>
                            <MenuItem onClick={_handleUMenuClose}><SettingsRoundedIcon /> Account Settings</MenuItem>
                            <MenuItem onClick={async () => {
                                setSignVerifyData({uid: null, key: null,
                                    hash: await getHexHash(signKeys.current.pubSign), open: true, mode: 1});
                                _handleUMenuClose();
                            }}>
                                <VerifiedUserRoundedIcon /> Verify Sign Key
                            </MenuItem>
                        </Menu>
                    </Card>

                    <Card sx={{flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}
                          elevation={6}>
                        {
                            curGid
                                ? <>
                                    <ListItem button divider ContainerComponent='div'
                                              onClick={() => {
                                                  setCSettingData({
                                                      name: chatList[curGid].name,
                                                  });
                                                  setChatSettingOpen(true);
                                              }}>
                                        <ListItemAvatar><Avatar><ImageIcon/></Avatar></ListItemAvatar>
                                        <ListItemText secondaryTypographyProps={{noWrap: true, mr: 2}}
                                            primary={chatList[curGid].name} secondary={chatList[curGid].people.join(', ') + ' & You'}/>
                                        <ListItemSecondaryAction>
                                            <IconButton edge='end' aria-label='' id='more-btn' aria-controls='more-menu'
                                                        onClick={e => setMenuAnchor(e.currentTarget)} sx={{mr: 0.0001}}>
                                                <MoreVertRoundedIcon />
                                            </IconButton>
                                            <Menu
                                                id='more-menu'
                                                sx={{'& .MuiSvgIcon-root': { color: 'text.secondary', marginRight: 1.5 }}}
                                                MenuListProps={{ 'aria-labelledby': 'more-btn' }}
                                                anchorEl={menuAnchor}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                open={menuOpen}
                                                onClose={_handleMenuClose}>
                                                <MenuItem onClick={() => {
                                                    setCurGid(v => {
                                                        setNewTitle(chatList[v].name);
                                                        setChangeTitleOpen(true);
                                                        _handleMenuClose();
                                                        return v;
                                                    })
                                                }}>
                                                    <DriveFileRenameOutlineRoundedIcon />
                                                    Edit Chat Title
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    setDelDialogOpen(true);
                                                    _handleMenuClose();
                                                }}>
                                                    <DeleteForeverRoundedIcon />
                                                    Delete chat
                                                </MenuItem>
                                            </Menu>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    <MsgHistory c={chats} uid={usrUID} r={msgScroller}/>

                                    <MsgInput m={msg} sm={setMsg} send={_handleSend}/>
                                </>
                                : <NoChatPlaceholder />
                        }
                    </Card>
                </div>
            </div>

            { /* Create chat dialog */ }
            <Dialog
                maxWidth='xs'
                open={addDialogOpen}
                onClose={_handleAddClose}
                aria-labelledby='ac-d-t'
                aria-describedby='ac-d-d'>
                <DialogTitle id='ac-d-t'>Add/Join a Chat</DialogTitle>
                <DialogContent>
                    <DialogContentText id='ac-d-d'>
                        Enter your recipient's UID here. This identifier does not need to be kept private.
                    </DialogContentText>
                    <TextField variant='filled' sx={{width: '100%'}} label='Name' value={addVal.name}
                               onChange={e => setAddVal({...addVal, name: e.target.value})}/>
                    <TextField sx={{width: '100%', mt: 2, '&>div': {fontFamily: 'Courier'}}} label='UID'
                               variant='outlined'
                               onChange={e => setAddVal({...addVal, gid: e.target.value})} value={addVal.gid}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={_handleAddClose}>Close</Button>
                    <Button onClick={() => {
                        setChatList({
                            ...chatList, [uuid()]: {
                                name: addVal.name,
                                people: [addVal.gid]
                            }
                        });
                        requestSignKey(addVal.gid);
                        _handleAddClose();
                    }}>Add</Button>
                </DialogActions>
            </Dialog>

            { /* Delete chat confirmation dialog */ }
            <Dialog
                maxWidth='xs'
                open={delDialogOpen}
                onClose={_handleDelClose}
                aria-labelledby='cd-d-t'
                aria-describedby='cd-d-d'>
                <DialogTitle id='cd-d-t'>Delete chat?</DialogTitle>
                <DialogContent>
                    <DialogContentText mb='0!important'>
                        All messages will be deleted. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={_handleDelClose}>Cancel</Button>
                    <div style={{flexGrow: 1}}/>
                    <Button onClick={() => {
                        const gid = curGid;
                        setCurGid(null);
                        setChatList(val => {
                            const n = {...val};
                            delete n[gid];
                            return n;
                        });
                        setChats([]);
                        requestAnimationFrame(() => {
                            delete chatData[gid];
                            console.log(chatData);
                            syncData(true);
                        })
                        _handleDelClose();
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>

            { /* Edit chat title dialog */ }
            <Dialog
                maxWidth='xs'
                open={changeTitleOpen}
                onClose={_handleChangeTitleClose}
                aria-labelledby='ct-d-t'
                aria-describedby='ct-d-d'>
                <DialogTitle id='ct-d-t'>Edit Chat Title</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a new title for this chat below. It does not need to be unique.
                    </DialogContentText>
                    <TextField variant='filled' value={newTitle} onChange={e => setNewTitle(e.target.value)}
                               label='New Chat Title' sx={{width: '100%'}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={_handleChangeTitleClose}>Cancel</Button>
                    <Button onClick={() => {
                        setChatList(val => {
                            const dupe = {...val};
                            dupe[curGid].name = newTitle;
                            return dupe
                        })
                        _handleChangeTitleClose()
                    }}>Change Title</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={signVerifyData.open}
                onClose={() => setSignVerifyData({open: false})}
                aria-labelledby='ct-d-t'
                aria-describedby='ct-d-d'>
                <DialogTitle id='ct-d-t'>Verify { signVerifyData.mode === 0 ? 'New' : 'Your' } Public Key</DialogTitle>
                <DialogContent>
                    <DialogContentText align='center' mb={'0!important'}>
                        {
                            signVerifyData.mode === 0 && <>
                                Received a new public signing key from <span className={classes.code}>{signVerifyData.uid}</span>
                                Cross check the code below with this person to ensure this key is authentic.
                                This ensures your messages can only be decrypted by your recipient.
                            </>
                        }
                        {
                            signVerifyData.mode === 1 && <>
                                Cross check the code below with the code your recipient received.
                            </>
                        }
                        <span className={classes.code} style={{fontWeight: 900}}>{signVerifyData?.hash?.join(' ')}</span>
                        <small style={{display: 'block', marginBottom: 8}}>
                            Ask your recipient to click on [
                            {signVerifyData.mode === 0 ? 'Your Account' : '(Your icon in chat)'} > Verify Sign Key] to verify this key.
                        </small>
                        You can delete signing keys at [Settings > Manage Signing Keys]
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSignVerifyData({open: false})}>{ signVerifyData.mode === 0 ? 'Reject' : 'Close' }</Button>
                    <div style={{flexGrow: 1}}/>
                    {
                        signVerifyData.mode === 0 &&  <Button onClick={() => {
                            signPubKeys = {...signPubKeys, [signVerifyData.uid]: signVerifyData.key};
                            syncSignKeys();
                            setSignVerifyData({open: false});
                            if (signKeyAct.current && signKeyAct.current.uid === signVerifyData.uid && signKeyAct.current.act)
                                signKeyAct.current.act();
                        }}>Accept</Button>
                    }
                </DialogActions>
            </Dialog>

            <ChatSettings open={chatSettingOpen} so={setChatSettingOpen} cg={curGid} cl={chatList} sCl={setChatList}
                          d={cSettingData} rsk={requestSignKey}/>

            <Snackbar open={snackbar.open} autoHideDuration={3000}
                      onClose={() => setSnackbar({...snackbar, open: false})}>
                <Alert onClose={() => setSnackbar({...snackbar, open: false})} elevation={6} variant='filled'
                       severity={snackbar.type} sx={{width: '100%'}}>
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </>
    )
}