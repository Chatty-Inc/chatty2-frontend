import {
    Avatar,
    Button,
    Dialog,
    IconButton,
    ListItemAvatar, ListSubheader,
    Paper,
    Slide,
    Switch, Tabs,
    TextField
} from '@material-ui/core';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tab from '@material-ui/core/Tab';

// Icons
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import UploadRoundedIcon from '@material-ui/icons/UploadRounded';

import { useState } from 'react';

const drawerWidth = 240;

const SettingsTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            {...other}>
            {value === index && (
                <Box sx={{ p: 1.5 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ChatSettings(props) {
    const { d } = props;
    const drawerItems = [
        {icon: <VisibilityRoundedIcon />, title: 'Overview'},
        {icon: <LockRoundedIcon />, title: 'Security'},
        {icon: <PeopleRoundedIcon />, title: 'Roles'},
    ];

    const permissions = [
        {title: 'General Permissions'},
        {title: 'Administrator', desc: 'Grant user all permissions'},
        {title: 'Create Invite', desc: 'Allows members to create a chat invite for others to join the chat'},

        {title: 'Text Permissions'},
        {title: 'Delete Messages', desc: 'Allows members to delete their own messages'},
        {title: 'Manage Messages', desc: 'Allows members to delete other\'s messages and pin messages'},
    ]

    const [selSubItem, setSelSubItem] = useState(0),
    [switches, setSwitches] = useState({}),
    [perms, setPerms] = useState({}),
    [roles, setRoles] = useState([
        {name: 'Owner', color: '#fbc02d'},
        {name: 'Wang', color: '#1e88e5'},
        {name: 'Lol', color: '#ef5350'},
        {name: 'Testers', color: '#ab47bc'},
        {name: 'Die-no', color: '#4caf50'},
        {name: 'A very long role that will be truncated', color: '#26a69a'},
        {name: 'Lower roles have less priority', color: '#78909c'},
    ]),
    [selRole, setSelRole] = useState(0),
    [roleTab, setRoleTab] = useState('appear');

    const handleToggle = (value, idx, perm = false) => () => {
        let s, ss;
        if (perm) {
            s = perms;
            ss = setPerms;
        }
        else {
            s = switches;
            ss = setSwitches;
        }
        if (!s[idx]) {
            ss(ov => {
                return {
                    ...ov, [idx]: [value]
                }
            });
            return;
        }

        const currentIndex = s[idx].indexOf(value);
        const newChecked = [...s[idx]];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        ss(ov => {
            return {
                ...ov, [idx]: newChecked
            }
        });
    };

    return <Dialog open={props.open} onClose={() => props.so(false)}
                   TransitionComponent={SettingsTransition}
                   fullScreen
                   PaperProps={{elevation: 8}}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position='fixed'
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={() => props.so(false)}
                        aria-label='close'
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant='h6' noWrap component='div'>
                        Chat Settings for {d.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                PaperProps={{elevation: 4}}
                variant='permanent'
                anchor='left'>
                <Toolbar />
                <List>
                    {drawerItems.map((item, index) => (
                        <ListItem button key={item.title} onClick={() => setSelSubItem(index)} selected={selSubItem === index}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component='main'
                sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                { selSubItem === 0 &&
                    <>
                        <Typography variant='h4'>Overview</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', my: 2}}>
                            <Box sx={{mr: 2, position: 'relative'}}>
                                <Box sx={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: '#00000066', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, zIndex: 2,
                                    transition: theme => theme.transitions.create(['opacity']), backdropFilter: 'blur(6px)',
                                    padding: '15%', borderRadius: '50%', flexDirection: 'column', '&:hover': {opacity: 1}
                                }}>
                                    <Typography align='center' mb={1} variant='button' fontWeight={700}>Change Icon</Typography>
                                    <Button startIcon={<UploadRoundedIcon />} variant='outlined'>Upload</Button>
                                </Box>
                                <Avatar sx={{width: 150, height: 150}} />
                            </Box>
                            <Divider orientation='vertical' flexItem sx={{mr: 2}}/>
                            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                <Typography variant='h6' gutterBottom>Chat Info</Typography>
                                <TextField variant='filled' label='Title' value={d.name}/>
                                <TextField variant='outlined' label='Description' multiline sx={{mt: 2}} maxRows={5}/>
                            </Box>
                        </Box>
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PublicRoundedIcon />
                                </ListItemIcon>
                                <ListItemText id='sl-disc' primary='Public Chat' secondary='Allow random people to join your chat' />
                                <Switch
                                    edge='end'
                                    onChange={handleToggle('discovery', 0)}
                                    checked={(switches[0] ?? []).includes('discovery')}
                                    inputProps={{
                                        'aria-labelledby': 'sl-disc',
                                    }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PublicRoundedIcon />
                                </ListItemIcon>
                                <ListItemText id='sl-disc' primary='Public Chat' secondary='Allow random people to join your chat' />
                                <Switch
                                    edge='end'
                                    onChange={handleToggle('discovery', 0)}
                                    checked={(switches[0] ?? []).includes('discovery')}
                                    inputProps={{
                                        'aria-labelledby': 'sl-disc',
                                    }}
                                />
                            </ListItem>
                        </List>
                    </>
                }
                { selSubItem === 1 &&
                    <>
                        <Typography variant='h4' gutterBottom>Security</Typography>
                        <Typography variant='subtitle1' gutterBottom>
                            Change various security settings of your chat
                        </Typography>
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <LockRoundedIcon />
                                </ListItemIcon>
                                <ListItemText id='e2ee-disc' primary='Encrypted Chat'
                                              secondary='Enables end to end encryption (cannot be undone)' />
                                <Switch
                                    edge='end'
                                    onChange={handleToggle('e2ee', 1)}
                                    checked={(switches[1] ?? []).includes('e2ee')}
                                    inputProps={{
                                        'aria-labelledby': 'e2ee-disc',
                                    }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PublicRoundedIcon />
                                </ListItemIcon>
                                <ListItemText id='lol-disc' primary='Lol no'
                                              secondary='Hey' />
                                <Switch
                                    edge='end'
                                    onChange={handleToggle('hm', 1)}
                                    checked={(switches[1] ?? []).includes('hm')}
                                    inputProps={{
                                        'aria-labelledby': 'lol-disc',
                                    }}
                                />
                            </ListItem>
                        </List>
                    </>
                }
                { selSubItem === 2 &&
                    <>
                        <Typography variant='h4' gutterBottom>Roles</Typography>
                        <Typography variant='subtitle1' gutterBottom>
                            Edit and create user roles to manage permissions of
                        </Typography>
                        <Divider />

                        <Box sx={{display: 'flex', alignItems: 'flex-start', mt: 2}}>
                            <Paper sx={{width: drawerWidth, mr: 1, overflow: 'hidden'}}>
                                <List sx={{p: 0}}>
                                    {
                                        roles.map((r, i) => <ListItem button
                                                                      onClick={() => setSelRole(i)}
                                                                      key={r.name} selected={selRole === i}>
                                            <ListItemAvatar>
                                                <Avatar sx={{background: r.color, width: 36, height: 36}}>{r.name.slice(0, 1)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={r.name} primaryTypographyProps={{noWrap: true}}/>
                                        </ListItem>)
                                    }
                                </List>
                            </Paper>

                            <Paper sx={{ml: 1, flex: 1, px: 1, pt: 1}}>
                                <Typography variant='button' fontWeight={700} m={1} component='h6'>
                                    Edit Role: {roles[selRole].name}
                                </Typography>

                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs onChange={(e, nv) => setRoleTab(nv)} value={roleTab}>
                                            <Tab label='Appearance' value='appear' />
                                            <Tab label='Permissions' value='perms' />
                                            <Tab label='Manage Users' value='usrMgmt' />
                                        </Tabs>
                                    </Box>

                                    <TabPanel index='appear' value={roleTab}>
                                        <TextField variant='filled' label='Role Name' value={roles[selRole].name} fullWidth />
                                    </TabPanel>

                                    <TabPanel index='perms' value={roleTab}>
                                        <TextField variant='outlined' label='Search permissions' fullWidth size='small' sx={{my: .5}} />
                                        <List sx={{pb: 0}}>
                                            {
                                                permissions.map(perm => {
                                                    const id = perm.title.replace(' ', '')
                                                    return <ListItem key={perm.title} sx={perm.desc ? {} : {py: 0}} disableGutters>
                                                        <ListItemText id={id + '-disc'}
                                                                      secondaryTypographyProps={perm.desc ? {} : {
                                                                          variant: 'button',
                                                                          fontWeight: 700,
                                                                          fontSize: 13,
                                                                      }}
                                                                      primary={perm.desc ? perm.title : ''}
                                                                      secondary={perm.desc ?? perm.title} />
                                                        {
                                                            perm.desc && <Switch
                                                                edge='end'
                                                                onChange={handleToggle(id, selRole, true)}
                                                                checked={(perms[selRole] ?? []).includes(id)}
                                                                inputProps={{
                                                                    'aria-labelledby': id + '-disc',
                                                                }}
                                                            />
                                                        }
                                                    </ListItem>
                                                }

                                                )
                                            }

                                        </List>
                                    </TabPanel>

                                    <TabPanel index='usrMgmt' value={roleTab}>Item Three</TabPanel>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                }
            </Box>
        </Box>
    </Dialog>
}