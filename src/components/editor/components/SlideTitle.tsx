import React from 'react';

interface SlideTitleProps {
  text: string;
  size: string;
  alignment: string;
}

export const SlideTitle = (props: any) => {
  const { text, size, alignment } = props;
  return (
    <h1 className={`font-bold text-slate-gray mb-4 ${size} ${alignment}`}>
      {text}
    </h1>
  );
};