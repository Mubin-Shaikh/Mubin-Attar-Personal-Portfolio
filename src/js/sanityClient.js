// This file configures the client that connects to your Sanity backend

// IMPORT the function directly from the package we installed
import { createClient } from '@sanity/client';

// This is the modern, reliable way to create the client
export const client = createClient({
  projectId: '9koh6yu9', // Your Project ID is correct
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2024-03-11', // use a UTC date in YYYY-MM-DD format
});