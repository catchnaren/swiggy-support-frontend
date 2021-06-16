const stageUrl = 'https://swiggy-support-stage.herokuapp.com';

export interface KeywordsData {
  keywords: {
    keyword: {
      id: string;
      textSnippet: string;
      keywordText: string;
    };
  }[];
}

export interface KeywordData {
  keyword: {
    keywordText: string;
    textSnippet: string;
  };
}

export async function fetchKeywordData(keyword: string): Promise<KeywordData> {
  const res = await fetch(`${stageUrl}/api/keywords/keyword/${keyword}`);

  if (!res.ok) {
    throw new Error('Keyword not found');
  }

  const data: KeywordData = await res.json();
  return data;
}

export async function fetchKeywordsData(): Promise<KeywordsData> {
  const res = await fetch(`${stageUrl}/api/keywords/`);

  if (!res.ok) {
    throw new Error('Keywords not found');
  }

  const data: KeywordsData = await res.json();
  return data;
}

export async function postKeyword(data: string): Promise<any> {
  const res = await fetch(`${stageUrl}/api/keywords`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textInput: data }),
  });

  if (!res.ok) {
    throw new Error('Keyword not posted');
  }

  const postedData: any = await res.json();
  return postedData;
}

export async function deleteKeyword(keywordId: string): Promise<any> {
  const res = await fetch(`${stageUrl}/api/keywords/${keywordId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Keyword not deleted');
  }

  const data = await res.json();
  return data;
}

export async function updateKeyword(keywordId, data): Promise<any> {
  const res = await fetch(`${stageUrl}/api/keywords/${keywordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  //{keywordText: 'disc', textSnippet: 'discount of 25%'}

  if (!res.ok) {
    throw new Error('Keyword not posted');
  }

  const updatedData = await res.json();
  return updatedData;
}
