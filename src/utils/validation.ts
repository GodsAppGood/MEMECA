import { validateDescription, validateUrl } from "@/utils/validation";

export const validateMemeTitle = (title: string): string | null => {
  if (!title) {
    return "Title is required";
  }
  if (title.length > 25) {
    return "Title must not exceed 25 characters";
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
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w\\-]+(\\/[\\w\\- .\\/\\?%&=]*)?$"
  );
  if (url && !urlPattern.test(url)) {
    return "Invalid URL format";
  }
  return null;
};
