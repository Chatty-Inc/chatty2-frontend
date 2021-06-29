import { Avatar, Badge, Box, Button, Dialog, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { useState } from 'react';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            {...other}>
            {value === index && (
                <Box sx={{ px: 2.5, py: 2 }}>{children}</Box>
            )}
        </div>
    );
}

export default function ProfileDialog(props) {
    const [selTab, setSelTab] = useState(0);

    return <Dialog open={props.open} onClose={() => props.sOpen(false)} maxWidth='sm' fullWidth PaperProps={{variant: 'outlined'}}>
        <Box height={120} bgcolor='primary.main' />
        <Badge badgeContent=' ' color='success' overlap='circular'
               anchorOrigin={{
                   vertical: 'bottom',
                   horizontal: 'right',
               }}
               sx={{width: 136, height: 136, position: 'absolute', top: 52, left: 16, '& span.MuiBadge-badge': {
                   transform: 'scale(1) translate(calc(50% - 8px), calc(50% - 8px))',
                   border: t => `8px solid ${t.palette.background.paper}`,
                   width: 40,
                       height: 40,
                       borderRadius: '50%'
               }}}>
            <Avatar sx={{border: t => `8px solid ${t.palette.background.paper}`, width: 136, height: 136}} />
        </Badge>

        <Box height={48} p={'1rem 1rem 0 10rem'} display='flex'>
            <div style={{flexGrow: 1}} />
            <Button variant='contained' color='success'>Create Chat</Button>
        </Box>

        <Box margin='2rem 1rem 0'>
            <Typography variant='h5' fontWeight={700}>
                Scam<Typography color='text.secondary' component='span' fontWeight='inherit'>#1234</Typography>
            </Typography>
            <Typography variant='subtitle1' color='text.secondary' gutterBottom>Custom user status</Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selTab} onChange={(e, v) => setSelTab(v)} aria-label='user profile tabs'>
                <Tab label='Info' />
                <Tab label='Mutual Chats' />
                <Tab label='Connections' />
            </Tabs>
        </Box>
        <TabPanel value={selTab} index={0}>
            <Typography variant='button'>Info</Typography>
        </TabPanel>
        <TabPanel value={selTab} index={1}>
            <Typography variant='button'>Mutual Chats</Typography>
        </TabPanel>
        <TabPanel value={selTab} index={2}>
            <Box display='grid' gridTemplateColumns='1fr 1fr' gap={1.5}>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Reddit" role="img" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#f40"/><g fill="#fff">
                        <ellipse cx="256" cy="307" rx="166" ry="117"/><circle cx="106" cy="256" r="42"/><circle cx="407" cy="256" r="42"/><circle cx="375" cy="114" r="32"/></g><g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="m256 196 23-101 73 15" stroke="#fff" stroke-width="16"/><path d="m191 359c33 25 97 26 130 0" stroke="#f40" stroke-width="13"/></g><g fill="#f40"><circle cx="191" cy="287" r="31"/><circle cx="321" cy="287" r="31"/></g></svg>
                    <Typography ml={1.5}>Reddit</Typography>
                </Paper>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="GitHub" role="img" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#1B1817"/>
                        <path fill="#fff" d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"/></svg>
                    <Typography ml={1.5}>GitHub</Typography>
                </Paper>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#5865f2" aria-label="Discord" role="img" version="1.1" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#fff"/>
                        <path d="m386 137c-24-11-49.5-19-76.3-23.7c-.5 0-1 0-1.2.6c-3.3 5.9-7 13.5-9.5 19.5c-29-4.3-57.5-4.3-85.7 0c-2.6-6.2-6.3-13.7-10-19.5c-.3-.4-.7-.7-1.2-.6c-23 4.6-52.4 13-76 23.7c-.2 0-.4.2-.5.4c-49 73-62 143-55 213c0 .3.2.7.5 1c32 23.6 63 38 93.6 47.3c.5 0 1 0 1.3-.4c7.2-9.8 13.6-20.2 19.2-31.2c.3-.6 0-1.4-.7-1.6c-10-4-20-8.6-29.3-14c-.7-.4-.8-1.5 0-2c2-1.5 4-3 5.8-4.5c.3-.3.8-.3 1.2-.2c61.4 28 128 28 188 0c.4-.2.9-.1 1.2.1c1.9 1.6 3.8 3.1 5.8 4.6c.7.5.6 1.6 0 2c-9.3 5.5-19 10-29.3 14c-.7.3-1 1-.6 1.7c5.6 11 12.1 21.3 19 31c.3.4.8.6 1.3.4c30.6-9.5 61.7-23.8 93.8-47.3c.3-.2.5-.5.5-1c7.8-80.9-13.1-151-55.4-213c0-.2-.3-.4-.5-.4Zm-192 171c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38zm125 0c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38z" fill="#5865f2"/>
                    </svg>
                    <Typography ml={1.5}>Discord</Typography>
                </Paper>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Kotlin" role="img" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#27282c"/>
                        <path fill="#09d" d="M410 410H102V102h154v154"/><path fill="#f80" d="M410 102H256L102 267v143"/>
                    </svg>
                    <Typography ml={1.5}>Kotlin (no)</Typography>
                </Paper>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Apple" role="img" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#555"/>
                        <path fill="#f2f2f2" d="M410 334s-10 29-30 59c-5 9-29 43-58 43-21 0-35-15-62-15-33 0-46 15-67 15-11 1-22-5-34-16-77-73-81-181-52-225 18-29 48-47 81-48 26 0 54 17 65 17 8 0 50-20 74-18 33 3 56 15 73 38-49 24-66 117 10 150zM329 56c8 32-27 93-79 90-3-43 34-87 79-90z"/>
                    </svg>
                    <Typography ml={1.5}>Apple</Typography>
                </Paper>
                <Paper variant='outlined' sx={{p: 1, display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft" role="img" viewBox="0 0 512 512" style={{borderRadius: '8px', width: 32, height: 32}}>
                        <rect width="512" height="512" rx="15%" fill="#fff"/><path d="M75 75v171h171v-171z" fill="#f25022"/><path d="M266 75v171h171v-171z" fill="#7fba00"/>
                        <path d="M75 266v171h171v-171z" fill="#00a4ef"/><path d="M266 266v171h171v-171z" fill="#ffb900"/>
                    </svg>
                    <Typography ml={1.5}>Microsoft</Typography>
                </Paper>
            </Box>
        </TabPanel>
    </Dialog>
}