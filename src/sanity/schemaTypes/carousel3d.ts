import { defineType, defineField } from 'sanity'

export const carousel3d = defineType({
  name: 'carousel3d',
  title: '3D Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: '3D Carousel Settings',
      readOnly: true,
    }),
    defineField({
      name: 'globalMediaType',
      title: 'Global Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'All Videos', value: 'videos' },
          { title: 'All Photos', value: 'photos' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'custom',
    }),
    
    // Card 1
    defineField({
      name: 'card1',
      title: 'Card 1',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 2
    defineField({
      name: 'card2',
      title: 'Card 2',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 3
    defineField({
      name: 'card3',
      title: 'Card 3',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 4
    defineField({
      name: 'card4',
      title: 'Card 4',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 5
    defineField({
      name: 'card5',
      title: 'Card 5',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 6
    defineField({
      name: 'card6',
      title: 'Card 6',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 7
    defineField({
      name: 'card7',
      title: 'Card 7',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 8
    defineField({
      name: 'card8',
      title: 'Card 8',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 9
    defineField({
      name: 'card9',
      title: 'Card 9',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 10
    defineField({
      name: 'card10',
      title: 'Card 10',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 11
    defineField({
      name: 'card11',
      title: 'Card 11',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 12
    defineField({
      name: 'card12',
      title: 'Card 12',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 13
    defineField({
      name: 'card13',
      title: 'Card 13',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),

    // Card 14
    defineField({
      name: 'card14',
      title: 'Card 14',
      type: 'object',
      fields: [
        {
          name: 'isVideo',
          title: 'Video Mode',
          description: 'Toggle on for video, off for images',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'image1',
          title: 'Image 1',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image2',
          title: 'Image 2',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'image3',
          title: 'Image 3',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'text',
          title: 'Card Text',
          type: 'text',
          rows: 3,
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '3D Carousel Settings',
        subtitle: 'Singleton document for carousel configuration',
      }
    },
  },
})