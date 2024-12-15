import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "./UnifiedMemeCard";
import { useEffect, useState } from "react";
import { MemeSlider } from "./MemeSlider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const placeholderImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
];

export const TopMemeGrid = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { data: userLikes = [] } = useQuery({
    queryKey: ["user-likes", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('Watchlist')
        .select('meme_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.map(item => item.meme_id.toString()) ?? [];
    }
  });

  const { data: userPoints = 100 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: async () => {
      return 100;
    }
  });

  const { data: memes = [], isLoading, refetch } = useQuery({
    queryKey: ["top-memes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .order('likes', { ascending: false })
        .limit(200);
      
      if (error) throw error;
      return data?.map(meme => ({
        ...meme,
        id: meme.id.toString()
      })) || [];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('memes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Memes' },
        () => {
          void refetch();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  const totalSlots = 200;
  const remainingSlots = Math.max(0, totalSlots - memes.length);
  const placeholderCards = Array.from({ length: remainingSlots }, (_, index) => ({
    id: `placeholder-${index}`,
    title: "Empty Slot",
    image_url: placeholderImages[index % placeholderImages.length],
    likes: 0,
    created_at: new Date().toISOString(),
    isPlaceholder: true
  }));

  const allCards = [...memes, ...placeholderCards];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSliderChange = (value: number[]) => {
    setCurrentSlide(value[0]);
  };

  return (
    <div className="space-y-4">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
        setApi={(api) => {
          api?.on("select", () => {
            const selectedIndex = api.selectedScrollSnap();
            setCurrentSlide(selectedIndex);
          });
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {allCards.map((meme, index) => (
            <CarouselItem key={meme.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <UnifiedMemeCard
                meme={meme}
                position={index + 1}
                userLikes={userLikes}
                userPoints={userPoints}
                userId={userId}
                isFirst={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <MemeSlider
        currentSlide={currentSlide}
        totalSlides={allCards.length}
        onSlideChange={handleSliderChange}
      />
    </div>
  );
};