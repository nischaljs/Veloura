

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';


export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${BACKEND_URL}/${cleanPath}`;
};


export const addImageUrls = <T extends Record<string, any>>(
  obj: T, 
  imageFields: string[] = ['logo', 'image', 'avatar', 'banner']
): T => {
  const result = { ...obj } as T;
  
  imageFields.forEach(field => {
    if (result[field as keyof T]) {
      (result as any)[field] = getImageUrl(result[field as keyof T] as string);
    }
  });
  
  return result;
};


export const addImageUrlsToArray = <T extends Record<string, any>>(
  array: T[], 
  imageFields: string[] = ['logo', 'image', 'avatar', 'banner']
): T[] => {
  return array.map(item => addImageUrls(item, imageFields));
}; 