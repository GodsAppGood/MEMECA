import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { validateMemeTitle, validateDescription, validateUrl } from "@/utils/validation";
import { useState } from "react";

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tradeLink: string;
  setTradeLink: (value: string) => void;
  twitterLink: string;
  setTwitterLink: (value: string) => void;
  telegramLink: string;
  setTelegramLink: (value: string) => void;
  maxDescriptionLength: number;
}

export const FormFields = ({
  title,
  setTitle,
  description,
  setDescription,
  tradeLink,
  setTradeLink,
  twitterLink,
  setTwitterLink,
  telegramLink,
  setTelegramLink,
  maxDescriptionLength,
}: FormFieldsProps) => {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateField = (field: string, value: string) => {
    let error = null;
    switch (field) {
      case 'title':
        error = validateMemeTitle(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'tradeLink':
      case 'twitterLink':
      case 'telegramLink':
        error = validateUrl(value);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    validateField('title', value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxDescriptionLength) {
      setDescription(text);
      validateField('description', text);
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-serif mb-2">Meme Title</label>
        <Input
          value={title}
          onChange={handleTitleChange}
          className={`font-serif ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter meme title"
        />
        {errors.title && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.title}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Short Description</label>
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          className={`font-serif resize-none ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Enter description (max 200 characters)"
          maxLength={maxDescriptionLength}
        />
        <p className="text-sm text-gray-500 mt-1">
          {maxDescriptionLength - description.length} characters remaining
        </p>
        {errors.description && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.description}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Trade Link (Optional)</label>
        <Input
          type="url"
          value={tradeLink}
          onChange={(e) => {
            setTradeLink(e.target.value);
            validateField('tradeLink', e.target.value);
          }}
          className={`font-serif ${errors.tradeLink ? 'border-red-500' : ''}`}
          placeholder="https://..."
        />
        {errors.tradeLink && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.tradeLink}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Twitter Link</label>
        <Input
          type="url"
          value={twitterLink}
          onChange={(e) => {
            setTwitterLink(e.target.value);
            validateField('twitterLink', e.target.value);
          }}
          className={`font-serif ${errors.twitterLink ? 'border-red-500' : ''}`}
          placeholder="https://twitter.com/..."
        />
        {errors.twitterLink && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.twitterLink}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Telegram Link</label>
        <Input
          type="url"
          value={telegramLink}
          onChange={(e) => {
            setTelegramLink(e.target.value);
            validateField('telegramLink', e.target.value);
          }}
          className={`font-serif ${errors.telegramLink ? 'border-red-500' : ''}`}
          placeholder="https://t.me/..."
        />
        {errors.telegramLink && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.telegramLink}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};