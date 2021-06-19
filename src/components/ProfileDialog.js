import { Avatar, Badge, Box, Dialog, Typography } from '@material-ui/core';
import { useState } from 'react';

export default function ProfileDialog(props) {
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

        <Box height={48} />
        <Typography variant='h5' margin='2rem 1rem 0' fontWeight={700}>
            Scam<Typography color='text.secondary' component='span' fontWeight='inherit'>#1234</Typography>
        </Typography>
    </Dialog>
}