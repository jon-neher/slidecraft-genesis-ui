import React from 'react';

interface SlideTextProps {
  text: string;
  size: string;
  alignment: string;
}

export const SlideText = (props: any) => {
  const { text, size, alignment } = props;
  return (
    <p className={`text-slate-gray/80 leading-relaxed ${size} ${alignment}`}>
      {text}
    </p>
  );
};