import React from 'react';

interface SlideBulletsProps {
  items: { text: string }[];
  style: string;
}

export const SlideBullets = (props: any) => {
  const { items, style } = props;
  const listStyle = style === 'none' ? 'list-none' : `list-${style}`;
  
  return (
    <ul className={`text-slate-gray/80 space-y-2 ${listStyle} ${style === 'none' ? '' : 'pl-6'}`}>
      {items.map((item: any, index: number) => (
        <li key={index} className="leading-relaxed">
          {style === 'none' && <span className="mr-2">—</span>}
          {item.text}
        </li>
      ))}
    </ul>
  );
};