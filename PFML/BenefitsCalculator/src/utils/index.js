import React from 'react';
import { HelpTip } from '@massds/mayflower-react';

// eslint-disable-next-line import/prefer-default-export
export const getHelpTip = (question, theme, key) => {
  const text = (question.content).split(question.triggerText);
  return(
    <HelpTip
      textBefore={text[0]}
      triggerText={question.triggerText}
      textAfter={text[1]}
      id={`help-tip-${question.triggerText}`}
      labelID={`help-tip-${question.triggerText}-label`}
      theme={theme || 'c-primary'}
      helpText={question.helpText}
      key={key}
    />
  );
};
