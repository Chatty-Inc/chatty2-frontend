import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import { Typography } from '@material-ui/core';

import { memo } from 'react';

function NoChatPlaceholder(props) {

    return (
        <div style={{flexGrow: 1, padding: 10,
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            {
                props.addChat ?? false
                    ? <>
                        <AddCircleOutlineRoundedIcon sx={{width: '30%', height: '30%'}}/>
                        <Typography variant='h4' p={2} align='center' color='text.secondary'>
                            This space looks a little empty...
                        </Typography>
                        <Typography align='center'>Click on the add button above to create your first chat</Typography>
                    </>
                    : <>
                        <QuestionAnswerRoundedIcon sx={{width: '30%', height: '30%'}}/>
                        <Typography variant='h4' p={2} align='center' color='text.secondary'>Click on a chat to begin chatting!</Typography>
                    </>
            }

        </div>
    )
}

export default memo(NoChatPlaceholder);