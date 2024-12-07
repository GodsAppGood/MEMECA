import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const MAX_DESCRIPTION_LENGTH = 200;

const SubmitMeme = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [date, setDate] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(text);
    }
  };

  const remainingChars = MAX_DESCRIPTION_LENGTH - description.length;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a PNG, JPEG, or GIF file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image for your meme.",
        variant: "destructive"
      });
      return;
    }

    const newMeme = {
      id: Date.now().toString(),
      title,
      description,
      blockchain,
      date: date ? format(date, "PPP") : "",
      twitterLink,
      telegramLink,
      imageUrl,
    };

    // Get existing memes
    const existingMemes = JSON.parse(localStorage.getItem("memes") || "[]");
    
    // Add new meme
    const updatedMemes = [newMeme, ...existingMemes];
    
    // Save to localStorage
    localStorage.setItem("memes", JSON.stringify(updatedMemes));
    
    // Invalidate and refetch memes query
    await queryClient.invalidateQueries({ queryKey: ["memes"] });
    
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
                <div
                  className={`border-2 border-dashed rounded-lg p-4 h-80 flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${dragActive ? 'border-[#FF4500] bg-[#FF4500]/5' : 'border-gray-300 hover:border-[#FF4500] hover:bg-[#FF4500]/5'}
                    ${imageUrl ? 'bg-gray-50' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="max-h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-gray-500 font-serif">Click to upload image</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPEG, GIF (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={handleFileInput}
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
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    className="font-serif resize-none"
                    placeholder="Enter description (max 200 characters)"
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {remainingChars} characters remaining
                  </p>
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
