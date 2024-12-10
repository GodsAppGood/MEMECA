import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxDescriptionLength) {
      setDescription(text);
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-serif mb-2">Meme Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-serif"
          placeholder="Enter meme title"
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Short Description</label>
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          className="font-serif resize-none"
          placeholder="Enter description (max 200 characters)"
          maxLength={maxDescriptionLength}
        />
        <p className="text-sm text-gray-500 mt-1">
          {maxDescriptionLength - description.length} characters remaining
        </p>
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Trade Link (Optional)</label>
        <Input
          type="url"
          value={tradeLink}
          onChange={(e) => setTradeLink(e.target.value)}
          className="font-serif"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Twitter Link</label>
        <Input
          type="url"
          value={twitterLink}
          onChange={(e) => setTwitterLink(e.target.value)}
          className="font-serif"
          placeholder="https://twitter.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Telegram Link</label>
        <Input
          type="url"
          value={telegramLink}
          onChange={(e) => setTelegramLink(e.target.value)}
          className="font-serif"
          placeholder="https://t.me/..."
        />
      </div>
    </>
  );
};