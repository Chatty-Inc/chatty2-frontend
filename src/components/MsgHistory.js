import ChatBubble from './ChatBubble';
import { memo, useRef, useState } from 'react';

import { Virtuoso } from 'react-virtuoso';

function MsgHistory(props) {
    const vRef = useRef(),
    [isScroll, setIsScroll] = useState(false),
    [atBottom, setAtBottom] = useState(false);

    const scrollToBottom = () => {
        if (isScroll || !atBottom) return;
        setTimeout(() => vRef.current.scrollToIndex({
            index: props.c.length,
            align: 'end',
            behavior: 'auto'
        }), 1);
    }

    return <div style={{
        minHeight: 0,
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        overflowY: 'auto'
    }}>
        <div style={{minHeight: '100%', width: '100%', position: 'relative'}}>
            <Virtuoso
                isScrolling={setIsScroll}
                atBottomStateChange={setAtBottom}
                ref={vRef}
                key={props.vKey}
                style={{padding: '10px 0'}}
                initialTopMostItemIndex={props.c.length}
                overscan={2000}
                alignToBottom
                followOutput={() => 'smooth'}
                totalCount={props.c.length}
                itemContent={i => {
                    return <ChatBubble prevJoint={props.c[i + 1]?.uid.trim() === props.c[i]?.uid.trim()} first={i === 0}
                                       nextJoint={props.c[i - 1]?.uid.trim() === props.c[i]?.uid.trim()} last={i === props.c.length - 1}
                                       grpTitle={props.gl[props.cg].name} purpose={props.c[i]?.purpose ?? 'txt'} sb={scrollToBottom}
                                       userUID={props.uid} uid={props.c[i]?.uid} msg={props.c[i]?.msg} key={i}/>
                }} />
        </div>
    </div>
}

export default memo(MsgHistory);