import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  InputBase,
  IconButton,
  Paper,
} from '@material-ui/core';
import {
  Add as AddIcon,
  DeleteOutlined as DeleteIcon,
} from '@material-ui/icons';

import {
  deleteKeyword,
  fetchKeywordsData,
  KeywordsData,
  postKeyword,
} from '../utils/api';
import KeywordCard from './KeywordCard';

import './popup.css';

type KeywordCardState = 'loading' | 'error' | 'ready';

const KeywordCardContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
};

const App: React.FC<{}> = () => {
  const [keywordsData, setKeywordsData] = useState<KeywordsData | null>(null);
  const [cardState, setCardState] = useState<KeywordCardState>('loading');

  const [textInput, setTextInput] = useState<string>('');

  useEffect(() => {
    fetchKeywordsData()
      .then(data => {
        // console.log(data);
        setKeywordsData(data);
        // setKeywordsData(data.keywords);
        setCardState('ready');
      })
      .catch(err => setCardState('error'));
  }, []);

  if (cardState == 'loading' || cardState == 'error') {
    return (
      <KeywordCardContainer>
        <Typography variant="body1">
          {cardState == 'loading'
            ? 'Loading...'
            : 'Error: could not retrieve text templates for this keyword.'}
        </Typography>
      </KeywordCardContainer>
    );
  }

  const handleKeywordButtonClick = () => {
    if (textInput === '') {
      return null;
    }
    postKeyword(textInput).then(data => {
      setKeywordsData({
        keywords: [
          ...keywordsData.keywords,
          {
            keyword: {
              id: data.keyword.id,
              keywordText: data.keyword.keywordText,
              textSnippet: data.keyword.textSnippet,
            },
          },
        ],
      });
    });
    setTextInput('');
  };

  const handleKeywordDeleteClick = keywordId => {
    deleteKeyword(keywordId).then(data => {
      console.log(data.id);
      const newKeywords = keywordsData.keywords.filter(
        i => i.keyword.id !== data.id
      );
      console.log(newKeywords);
      setKeywordsData({
        keywords: newKeywords,
      });
    });
  };

  const handleSnippetSelect = snippet => {
    chrome.runtime.sendMessage(null, snippet);
  };

  const handleEdit = () => {};

  return (
    <Box mx="8px" my="16px">
      <Grid container>
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                className="input"
                placeholder="Add text snippet/keyword"
                value={textInput}
                onChange={event => setTextInput(event.target.value)}
              />
              <IconButton onClick={handleKeywordButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {keywordsData.keywords &&
        keywordsData.keywords.map((keywordData, index) => (
          <KeywordCardContainer key={index}>
            <KeywordCard
              key={index}
              keywordText={keywordData.keyword.keywordText}
              textSnippet={keywordData.keyword.textSnippet}
              handleSnippetSelect={() => {
                handleSnippetSelect(keywordData.keyword.textSnippet);
              }}
              handleEdit={handleEdit}
            />
            <CardActions>
              <DeleteIcon
                onClick={() => {
                  handleKeywordDeleteClick(keywordData.keyword.id);
                }}
              />
            </CardActions>
          </KeywordCardContainer>
        ))}
      <Box height="16px" />
    </Box>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
