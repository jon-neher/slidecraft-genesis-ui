import React from 'react';
import { Config } from '@measured/puck';
import { SlideTitle } from './components/SlideTitle';
import { SlideText } from './components/SlideText';
import { SlideBullets } from './components/SlideBullets';
import { SlideImage } from './components/SlideImage';
import { SlideChart } from './components/SlideChart';

export const slideConfig: Config = {
  components: {
    SlideTitle: {
      fields: {
        text: { type: 'text' },
        size: {
          type: 'select',
          options: [
            { label: 'Small', value: 'text-2xl' },
            { label: 'Medium', value: 'text-3xl' },
            { label: 'Large', value: 'text-4xl' },
            { label: 'Extra Large', value: 'text-5xl' }
          ]
        },
        alignment: {
          type: 'select',
          options: [
            { label: 'Left', value: 'text-left' },
            { label: 'Center', value: 'text-center' },
            { label: 'Right', value: 'text-right' }
          ]
        }
      },
      defaultProps: {
        text: 'Slide Title',
        size: 'text-3xl',
        alignment: 'text-center'
      },
      render: SlideTitle,
    },
    SlideText: {
      fields: {
        text: { type: 'textarea' },
        size: {
          type: 'select',
          options: [
            { label: 'Small', value: 'text-sm' },
            { label: 'Medium', value: 'text-base' },
            { label: 'Large', value: 'text-lg' },
            { label: 'Extra Large', value: 'text-xl' }
          ]
        },
        alignment: {
          type: 'select',
          options: [
            { label: 'Left', value: 'text-left' },
            { label: 'Center', value: 'text-center' },
            { label: 'Right', value: 'text-right' }
          ]
        }
      },
      defaultProps: {
        text: 'Add your text content here...',
        size: 'text-base',
        alignment: 'text-left'
      },
      render: SlideText,
    },
    SlideBullets: {
      fields: {
        items: {
          type: 'array',
          getItemSummary: (item: any) => item.text || 'Bullet point',
          defaultItemProps: { text: 'New bullet point' },
          arrayFields: {
            text: { type: 'text' }
          }
        },
        style: {
          type: 'select',
          options: [
            { label: 'Bullets', value: 'disc' },
            { label: 'Numbers', value: 'decimal' },
            { label: 'Dashes', value: 'none' }
          ]
        }
      },
      defaultProps: {
        items: [
          { text: 'First bullet point' },
          { text: 'Second bullet point' },
          { text: 'Third bullet point' }
        ],
        style: 'disc'
      },
      render: SlideBullets,
    },
    SlideImage: {
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' },
        width: { type: 'text' },
        height: { type: 'text' }
      },
      defaultProps: {
        src: '/placeholder.svg',
        alt: 'Slide image',
        width: '400px',
        height: '300px'
      },
      render: SlideImage,
    },
    SlideChart: {
      fields: {
        type: {
          type: 'select',
          options: [
            { label: 'Bar Chart', value: 'bar' },
            { label: 'Line Chart', value: 'line' },
            { label: 'Pie Chart', value: 'pie' },
            { label: 'Area Chart', value: 'area' }
          ]
        },
        title: { type: 'text' },
        data: { type: 'textarea' }
      },
      defaultProps: {
        type: 'bar',
        title: 'Chart Title',
        data: JSON.stringify([
          { name: 'A', value: 400 },
          { name: 'B', value: 300 },
          { name: 'C', value: 500 }
        ], null, 2)
      },
      render: SlideChart,
    }
  },
  root: {
    fields: {
      background: {
        type: 'select',
        options: [
          { label: 'White', value: 'bg-white' },
          { label: 'Light Gray', value: 'bg-gray-50' },
          { label: 'Electric Indigo', value: 'bg-electric-indigo/5' },
          { label: 'Gradient', value: 'bg-gradient-to-br from-electric-indigo/5 to-neon-mint/5' }
        ]
      }
    },
    defaultProps: {
      background: 'bg-white'
    },
    render: ({ children, background }: any) => {
      return React.createElement('div', { className: `min-h-screen p-8 ${background}` },
        React.createElement('div', { className: 'max-w-5xl mx-auto h-full aspect-[16/9] bg-white rounded-lg shadow-lg p-8 relative' },
          children
        )
      );
    },
  },
};