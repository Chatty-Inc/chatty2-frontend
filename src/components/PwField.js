import { FilledInput, FormControl, IconButton, InputLabel } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import VisibilityOffRoundedIcon from '@material-ui/icons/VisibilityOffRounded';
import { useState, forwardRef } from 'react';

const PwField = forwardRef((props, ref) => {
    const [showPw, setShowPw] = useState(false);

    return <FormControl sx={{...props.sx, '&>div': { pb: 0 }}} variant='filled'>
        <InputLabel htmlFor='pw'>Password</InputLabel>
        <FilledInput label='Password' sx={{width: '100%', pb: 1}} variant='filled'
                     ref={ref}
                     value={props.pw}
                     onChange={e => props.spw(e.target.value)}
                     id='pw'
                     type={showPw ? 'text' : 'password'}
                     endAdornment={
                         <InputAdornment position='end'>
                             <IconButton
                                 aria-label='toggle password visibility'
                                 onClick={() => setShowPw(!showPw)}
                                 onMouseDown={e => e.preventDefault()}
                                 edge='end'>
                                 {showPw ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                             </IconButton>
                         </InputAdornment>
                     }
                     autoComplete='current-password'/>
    </FormControl>
})

export default PwField;