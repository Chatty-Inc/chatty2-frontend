import ChatBubble from './ChatBubble';
import { memo } from 'react';
import { Typography } from '@material-ui/core';

function MsgHistory(props) {
    return <div style={{
        minHeight: 0,
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        overflowY: 'auto'
    }}>
        <div style={{minHeight: '100%', width: '100%', position: 'relative'}}>
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                display: 'flex', justifyContent: 'flex-end', flexDirection: 'column'
            }}>
                <div style={{padding: '5px 42px', overflowY: 'auto'}} ref={props.sRef}>
                    <Typography mb={1.5} color='text.secondary' align='center'>This is the beginning of the chat</Typography>
                    {
                        props.c.map((chat, i) => {
                            return <ChatBubble joined={props.c[i + 1]?.uid === chat.uid}
                                               userUID={props.uid} uid={chat.uid} msg={chat.msg}
                                               key={i}/>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}

export default memo(MsgHistory);