export const validateMemeTitle = (title: string): string | null => {
  if (!title) {
    return "Title is required";
  }
  if (title.length > 20) {
    return "Title must not exceed 20 characters";
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description) {
    return "Description is required";
  }
  if (description.length > 200) {
    return "Description must not exceed 200 characters";
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null; // URLs are optional
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w\\-]+(\\/[\\w\\- .\\/\\?%&=]*)?$"
  );
  if (!urlPattern.test(url)) {
    return "Invalid URL format";
  }
  return null;
};

export const validateBlockchain = (blockchain: string): string | null => {
  if (!blockchain) {
    return "Blockchain selection is required";
  }
  return null;
};