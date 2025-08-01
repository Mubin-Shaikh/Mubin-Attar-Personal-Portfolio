// schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the project.',
      validation: Rule => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true, // Enables cropping and placement of the image
      },
      description: 'The main visual for the project card.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'A brief category (e.g., Python, DevOps, Healthcare).',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A detailed, impact-oriented description of the project.',
      validation: Rule => Rule.required(),
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      description: 'A list of technologies used in this project.',
      options: {
        layout: 'tags' // Makes it look like a tag editor
      }
    },
    {
        name: 'repositoryUrl',
        title: 'Repository URL',
        type: 'url',
        description: 'The URL to the code repository (e.g., GitHub).',
    },
    {
        name: 'liveSiteUrl',
        title: 'Live Site URL',
        type: 'url',
        description: 'The URL to the live, deployed project.',
    },
  ],
}