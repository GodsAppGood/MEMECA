import { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { FormFields } from "./FormFields";
import { BlockchainSelector } from "./BlockchainSelector";
import { DateSelector } from "./DateSelector";
import { SubmitButton } from "./SubmitButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_DESCRIPTION_LENGTH = 200;

export const FormWrapper = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [tradeLink, setTradeLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth check error:', error);
        toast({
          variant: "destructive",
          title: "Ошибка аутентификации",
          description: "Пожалуйста, попробуйте войти снова.",
        });
        navigate('/');
        return;
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "Требуется аутентификация",
          description: "Пожалуйста, войдите для отправки мемов.",
        });
        navigate('/');
        return;
      }

      setUser(session.user);

      const editingMeme = localStorage.getItem("editingMeme");
      if (editingMeme) {
        const meme = JSON.parse(editingMeme);
        setTitle(meme.title);
        setDescription(meme.description || "");
        setBlockchain(meme.blockchain || "");
        setCreatedAt(meme.created_at ? new Date(meme.created_at) : undefined);
        setTwitterLink(meme.twitter_link || "");
        setTelegramLink(meme.telegram_link || "");
        setTradeLink(meme.trade_link || "");
        setImageUrl(meme.image_url);
        setIsEditing(true);
        setEditingId(meme.id);
        localStorage.removeItem("editingMeme");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите изображение.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Требуется аутентификация",
        description: "Пожалуйста, войдите для отправки мемов.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const memeData = {
        title,
        description,
        blockchain,
        twitter_link: twitterLink || null,
        telegram_link: telegramLink || null,
        trade_link: tradeLink || null,
        image_url: imageUrl,
        created_by: user.id,
        created_at: createdAt?.toISOString() || new Date().toISOString()
      };

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('Memes')
          .update(memeData)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('Memes')
          .insert([memeData]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Успех!",
        description: isEditing ? "Мем успешно обновлен." : "Мем успешно отправлен.",
      });
      
      navigate("/my-memes");
    } catch (error: any) {
      console.error('Error submitting meme:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось отправить мем",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          date={createdAt}
          setDate={setCreatedAt}
        />

        <SubmitButton isEditing={isEditing} isLoading={isSubmitting} />
      </div>
    </form>
  );
};