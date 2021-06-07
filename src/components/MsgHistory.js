import ChatBubble from './ChatBubble';
import { memo } from 'react';

import { Virtuoso } from 'react-virtuoso';

function MsgHistory(props) {
    return <div style={{
        minHeight: 0,
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        overflowY: 'auto'
    }}>
        <div style={{minHeight: '100%', width: '100%', position: 'relative'}}>
            <Virtuoso
                style={{padding: '10px 0'}}
                initialTopMostItemIndex={props.c.length}
                ref={props.r}
                overscan={250}
                alignToBottom
                followOutput={() => 'auto'}
                totalCount={props.c.length}
                itemContent={i => {
                    return <ChatBubble prevJoint={props.c[i + 1]?.uid.trim() === props.c[i]?.uid.trim()} first={i === 0}
                                       nextJoint={props.c[i - 1]?.uid.trim() === props.c[i]?.uid.trim()} last={i === props.c.length - 1}
                                       userUID={props.uid} uid={props.c[i]?.uid} msg={props.c[i]?.msg} key={i}/>
                }} />
        </div>
    </div>
}

export default memo(MsgHistory);