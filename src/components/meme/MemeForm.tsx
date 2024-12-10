import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";
import { FormFields } from "./FormFields";
import { format } from "date-fns";

const MAX_DESCRIPTION_LENGTH = 200;

export const MemeForm = () => {
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
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

    const memeData = {
      id: isEditing ? editingId! : Date.now().toString(),
      title,
      description,
      blockchain,
      dateAdded: isEditing ? undefined : new Date().toISOString(),
      date: date ? format(date, "PPP") : "",
      twitterLink: twitterLink || "",
      telegramLink: telegramLink || "",
      tradeLink: tradeLink || "",
      imageUrl,
      userId: "current-user-id", // This should be replaced with actual user ID
      likes: isEditing ? undefined : 0,
    };

    const existingMemes = JSON.parse(localStorage.getItem("memes") || "[]");
    let updatedMemes;

    if (isEditing) {
      updatedMemes = existingMemes.map((meme: any) => 
        meme.id === editingId ? { ...meme, ...memeData } : meme
      );
    } else {
      updatedMemes = [memeData, ...existingMemes];
    }

    localStorage.setItem("memes", JSON.stringify(updatedMemes));
    
    await queryClient.invalidateQueries({ queryKey: ["memes"] });
    
    toast({
      title: "Success!",
      description: isEditing ? "Your meme has been updated successfully." : "Your meme has been submitted successfully.",
    });
    
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <ImageUploader imageUrl={imageUrl} onImageChange={setImageUrl} />
      </div>

      <FormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        blockchain={blockchain}
        setBlockchain={setBlockchain}
        date={date}
        setDate={setDate}
        tradeLink={tradeLink}
        setTradeLink={setTradeLink}
        twitterLink={twitterLink}
        setTwitterLink={setTwitterLink}
        telegramLink={telegramLink}
        setTelegramLink={setTelegramLink}
        maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
      />

      <div className="col-span-1 md:col-span-2 mt-8">
        <Button
          type="submit"
          className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif text-lg py-6"
        >
          {isEditing ? "Save Changes" : "Submit Meme"}
        </Button>
      </div>
    </form>
  );
};