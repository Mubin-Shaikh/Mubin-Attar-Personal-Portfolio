export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'jobTitle', title: 'Job Title', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'isCurrent', title: 'Is Current Role?', type: 'boolean' },
    { name: 'startDate', title: 'Start Date', type: 'date', options: { dateFormat: 'MMM YYYY' } },
    { name: 'endDate', title: 'End Date', type: 'date', options: { dateFormat: 'MMM YYYY' } },
    { name: 'description', title: 'Description', type: 'text' },
  ],
  orderings: [ { title: 'Start Date, Newest First', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] } ],
}