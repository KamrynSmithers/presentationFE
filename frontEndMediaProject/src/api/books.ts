import axios from 'axios';

const OPENLIBRARY_BASE = 'https://openlibrary.org';

// Search books
export const searchBooks = async (query: string, page: number = 1) => {
  const response = await axios.get(`${OPENLIBRARY_BASE}/search.json`, {
    params: {
      q: query,
      page: page,
      limit: 50
    }
  });
  
  // Sort by publish year (newest first)
  return response.data.docs.sort((a: any, b: any) => {
    return (b.first_publish_year || 0) - (a.first_publish_year || 0);
  });
};

// Get trending/newest books
export const getTrendingBooks = async () => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const response = await axios.get(`${OPENLIBRARY_BASE}/search.json`, {
    params: {
      q: `first_publish_year:[${lastYear} TO ${currentYear}]`,
      sort: 'new',
      limit: 50  // Get more results
    }
  });
  
  // Sort by publish year (newest first), then by whether they have covers
  return response.data.docs.sort((a: any, b: any) => {
    // First sort by year (newest first)
    const yearDiff = (b.first_publish_year || 0) - (a.first_publish_year || 0);
    if (yearDiff !== 0) return yearDiff;
    
    // If same year, prioritize books with covers
    const aHasCover = !!(a.cover_i || a.cover_id);
    const bHasCover = !!(b.cover_i || b.cover_id);
    if (aHasCover && !bHasCover) return -1;
    if (!aHasCover && bHasCover) return 1;
    return 0;
  });
};

// Get book details by OpenLibrary ID
export const getBookDetails = async (bookId: string) => {
  const response = await axios.get(`${OPENLIBRARY_BASE}/works/${bookId}.json`);
  return response.data;
};

// Get book cover image URL
export const getBookCover = (coverId: number | string, size: 'S' | 'M' | 'L' = 'M') => {
  if (!coverId) return 'https://via.placeholder.com/200x300?text=No+Cover';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};