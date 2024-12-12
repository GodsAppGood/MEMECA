import { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { FormFields } from "./FormFields";
import { BlockchainSelector } from "./BlockchainSelector";
import { DateSelector } from "./DateSelector";
import { SubmitButton } from "./SubmitButton";
import { format } from "date-fns";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useMemeSubmission } from "@/hooks/useMemeSubmission";

const MAX_DESCRIPTION_LENGTH = 200;

export const FormWrapper = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [date, setDate] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [tradeLink, setTradeLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { session, isLoading: isAuthLoading } = useAuthCheck();
  const { submitMeme, isLoading: isSubmitting } = useMemeSubmission();

  useEffect(() => {
    const editingMeme = localStorage.getItem("editingMeme");
    if (editingMeme) {
      const meme = JSON.parse(editingMeme);
      setTitle(meme.title);
      setDescription(meme.description);
      setBlockchain(meme.blockchain);
      setDate(meme.date ? new Date(meme.date) : undefined);
      setTwitterLink(meme.twitterLink || "");
      setTelegramLink(meme.telegramLink || "");
      setTradeLink(meme.tradeLink || "");
      setImageUrl(meme.imageUrl);
      setIsEditing(true);
      setEditingId(meme.id);
      localStorage.removeItem("editingMeme");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image.",
        variant: "destructive"
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit memes.",
        variant: "destructive"
      });
      return;
    }

    const memeData = {
      title,
      description,
      blockchain,
      date: date ? format(date, "PPP") : null,
      twitter_link: twitterLink || null,
      telegram_link: telegramLink || null,
      trade_link: tradeLink || null,
      image_url: imageUrl,
      created_by: session.user.id,
    };

    await submitMeme(memeData, isEditing, editingId);
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <ImageUploader imageUrl={imageUrl} onImageChange={setImageUrl} />
      </div>

      <div className="space-y-6">
        <FormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
          tradeLink={tradeLink}
          setTradeLink={setTradeLink}
          twitterLink={twitterLink}
          setTwitterLink={setTwitterLink}
          telegramLink={telegramLink}
          setTelegramLink={setTelegramLink}
        />

        <BlockchainSelector
          blockchain={blockchain}
          setBlockchain={setBlockchain}
        />

        <DateSelector
          date={date}
          setDate={setDate}
        />

        <SubmitButton isEditing={isEditing} isLoading={isSubmitting} />
      </div>
    </form>
  );
};