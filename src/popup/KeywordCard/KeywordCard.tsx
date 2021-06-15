import React from 'react';

import { Box, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import './KeywordCard.css';

const KeywordCard: React.FC<{
  keywordText: string;
  textSnippet: string;
  handleSnippetSelect;
  handleEdit;
}> = ({ keywordText, textSnippet, handleSnippetSelect, handleEdit }) => {
  return (
    <Box my="16px" onClick={handleSnippetSelect}>
      {/* <Box className="edit">
        <EditIcon onClick={handleEdit} />
      </Box> */}
      <Typography variant="h5">/{keywordText}</Typography>
      <Typography variant="body1">{textSnippet}</Typography>
    </Box>
  );
};

export default KeywordCard;
