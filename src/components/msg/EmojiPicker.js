import { Box, Paper, Tabs, Tab } from '@material-ui/core';
import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../../assets/twemoji', false, /\.(png|jpe?g|svg|webp)$/));

console.log(images);

const ItemContainer = styled.div`
  padding: 5px;
  width: 42px;
  height: 42px;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: .4rem;
`;

export default function EmojiPicker() {
    const [curMode, setCurMode] = useState(0);

    return <Box sx={{width: 420, height: 450, overflow: 'hidden'}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={curMode} onChange={(e, v) => setCurMode(v)} aria-label='basic tabs example'>
                <Tab label='GIF' />
                <Tab label='Emoji' />
            </Tabs>
        </Box>
        <Box display='flex' height='calc(100% - 49px)'>
            <Paper sx={{width: '48px', height: '100%', gridArea: 'aside', borderRadius: '0'}}>
            </Paper>
            <VirtuosoGrid totalCount={images.length}
                          style={{flex: 1}}
                          components={{
                              Item: ItemContainer,
                              List: ListContainer,
                          }}
                          overscan={0}
                          itemContent={i =>
                              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 1 }}
                                             transition={{
                                                 type: 'spring',
                                                 mass: .4,
                                                 stiffness: 300,
                                                 damping: 5.5,
                                             }}
                                             onClick={e => {}}
                                             style={{background: 'none', border: 'none', overflow: 'hidden',
                                                 padding: 0, width: 32, height: 32, borderRadius: 2}}>
                                  <img src={images[i].default} alt='' width={32} height={32} draggable={false} />
                              </motion.button>
                          } />
        </Box>
    </Box>
}