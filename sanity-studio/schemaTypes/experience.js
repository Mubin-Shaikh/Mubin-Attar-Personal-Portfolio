// schemas/experience.js
export default {
    name: 'experience',
    title: 'Experience',
    type: 'document',
    fields: [
      {
        name: 'jobTitle',
        title: 'Job Title / Degree',
        type: 'string',
        description: 'Eg: Software Engineer or Master of Computer Application',
        validation: Rule => Rule.required(),
      },
      {
        name: 'company',
        title: 'Company / University',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'startDate',
        title: 'Start Date',
        type: 'date',
        options: {
          dateFormat: 'YYYY-MM',
        },
        validation: Rule => Rule.required(),
      },
      {
        name: 'endDate',
        title: 'End Date',
        type: 'date',
        options: {
          dateFormat: 'YYYY-MM',
        },
        description: 'Leave this blank if the position is current.',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        description: 'A summary of your role and accomplishments.',
        validation: Rule => Rule.required(),
      },
      {
        name: 'isEducation',
        title: 'Is this an Education Entry?',
        type: 'boolean',
        description: 'Check this box if this is a degree or certification.',
        initialValue: false,
      },
    ],
    // Sort experiences by start date by default
    orderings: [
        {
          title: 'StartDate, Newest First',
          name: 'startDateDesc',
          by: [{field: 'startDate', direction: 'desc'}],
        },
      ],
  }