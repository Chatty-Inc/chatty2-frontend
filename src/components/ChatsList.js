import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
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
                        return <ListItem button selected={props.cg === k} key={k} divider onClick={() => props.sg(k)}>
                            <ListItemAvatar>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={props.cl[k]?.name} secondary='Changhoa: Hm' />
                        </ListItem>
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
