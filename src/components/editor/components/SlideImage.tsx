import React from 'react';

interface SlideImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export const SlideImage = (props: any) => {
  const { src, alt, width, height } = props;
  return (
    <div className="flex justify-center">
      <img
        src={src}
        alt={alt}
        style={{ width, height }}
        className="rounded-lg shadow-sm object-cover"
      />
    </div>
  );
};