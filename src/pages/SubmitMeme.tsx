import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SubmitMeme = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [date, setDate] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically handle the form submission
    // For now, we'll just show a success message and redirect
    toast({
      title: "Success!",
      description: "Your meme has been submitted successfully.",
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-8">Submit Your Meme</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Image Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-80 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="max-h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 font-serif">Click to upload image</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setImageUrl(url);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6">
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
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="font-serif"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif mb-2">Blockchain</label>
                  <Select value={blockchain} onValueChange={setBlockchain}>
                    <SelectTrigger className="w-full font-serif">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana" className="font-serif">Solana</SelectItem>
                      <SelectItem value="ethereum" className="font-serif">Ethereum</SelectItem>
                      <SelectItem value="polygon" className="font-serif">Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-serif mb-2">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full font-serif justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
              </div>

              {/* Submit Button - Full Width */}
              <div className="col-span-1 md:col-span-2 mt-8">
                <Button
                  type="submit"
                  className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif text-lg py-6"
                >
                  Submit Meme
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Support />
      <Footer />
    </div>
  );
};

export default SubmitMeme;