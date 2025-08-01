import { createClient } from '@sanity/client';

export const client = createClient({
  // You will find these in your Sanity project settings
  projectId: 'uer1oa8t',
  dataset: 'production', 
  apiVersion: '2024-08-01', 
  useCdn: true, 
});