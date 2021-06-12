import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import NoChatPlaceholder from './NoChatPlaceholder';

import { memo } from 'react';

function ChatsList(props) {
    const keys = Object.keys(props.cl).filter(k => props.cl[k].name.toLowerCase().includes(props.q.trim().toLowerCase()));

    return (
        <List sx={{ width: '100%', p: 0, overflowY: 'auto' }}>
            {
                keys.length !== 0
                    ? keys.map((k => {
                        return <Tooltip title={props.cl[k]?.name} placement='right' key={k}>
                            <ListItem button selected={props.cg === k} divider dense={props.cv && props.ac}
                                      sx={(props.cv && props.ac) ? {padding: '.25rem .75rem', width: '64px', height: '64px'} : {}}
                                      onClick={() => props.sg(k)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={props.cl[k]?.name} secondary='Changhoa: Hm' />
                            </ListItem>
                        </Tooltip>
                    }))
                    : ( props.q.trim().length === 0
                    ? <NoChatPlaceholder addChat />
                    : <ListItem><ListItemText primary='No results'/></ListItem>
                    )
            }
        </List>
    )
}
export default memo(ChatsList);
