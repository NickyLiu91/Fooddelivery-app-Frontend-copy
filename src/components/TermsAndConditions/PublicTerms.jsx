import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';

import { Container, Typography } from '@material-ui/core';

import Loader from 'components/common/Loader/Loader';
import { TermsAndConditionsService, notifyService } from 'services';
import { getErrorMessage } from 'sdk/utils';

const getTerms = async (setTerms, setIsTermsLoading) => {
  try {
    const { content } = await TermsAndConditionsService.getTerms();
    setTerms(content);
  } catch (error) {
    console.log('[getTerms] error', error);
    notifyService.showError(getErrorMessage(error));
  } finally {
    setIsTermsLoading(false);
  }
};

function PublicTerms() {
  const [terms, setTerms] = useState(null);
  const [isTermsLoading, setIsTermsLoading] = useState(true);

  useEffect(() => {
    getTerms(setTerms, setIsTermsLoading);
  }, []);

  return (
    <Container>
      <Typography variant="h3">
        Terms and privacy policy
      </Typography>
      {isTermsLoading && <Loader />}
      {terms ? parse(terms) : ''}
    </Container>
  );
}

export default PublicTerms;
