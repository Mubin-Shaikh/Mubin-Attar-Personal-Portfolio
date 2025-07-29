export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'image', title: 'Image URL', type: 'url' },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
    { name: 'liveUrl', title: 'Live Demo URL', type: 'url' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}