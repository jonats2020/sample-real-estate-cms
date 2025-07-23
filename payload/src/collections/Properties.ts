import type { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'price', 'isPublished'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, originalDoc, data }: any) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'image',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: false,
        },
        {
          name: 'alt',
          type: 'text',
          required: false,
        }
      ]
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}