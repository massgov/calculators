import React from 'react';
import { HelpTip } from '@massds/mayflower-react';

// eslint-disable-next-line import/prefer-default-export
export const getHelpTip = (question, theme, key) => (
  <HelpTip
    text={question.content}
    triggerText={question.triggerText}
    id={`help-tip-${question.triggerText}`}
    labelID={`help-tip-${question.triggerText}-label`}
    theme={theme || 'c-primary'}
    helpText={question.helpText}
    key={key}
    hasMarkup
    bypassMobileStyle={false}
  />
);
