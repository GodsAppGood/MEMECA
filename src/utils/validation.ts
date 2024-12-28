export const validateMemeTitle = (title: string): string | null => {
  if (!title) return "Title is required";
  if (title.length < 3) return "Title must be at least 3 characters long";
  if (title.length > 100) return "Title must be less than 100 characters";
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description && description.length > 200) {
    return "Description must be less than 200 characters";
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null; // URLs are optional
  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

export const validateBlockchain = (blockchain: string): string | null => {
  if (!blockchain) return "Please select a blockchain";
  return null;
};

export const validateImageUrl = (imageUrl: string): string | null => {
  if (!imageUrl) return "Please upload an image";
  return null;
};