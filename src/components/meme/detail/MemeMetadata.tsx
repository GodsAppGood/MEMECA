import { format } from "date-fns";
import { Meme } from "@/types/meme";

interface MemeMetadataProps {
  meme: Meme;
}

export const MemeMetadata = ({ meme }: MemeMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {meme.blockchain && (
        <div>
          <h3 className="font-serif text-lg mb-2">Blockchain</h3>
          <p className="capitalize">{meme.blockchain}</p>
        </div>
      )}
      
      <div>
        <h3 className="font-serif text-lg mb-2">Date Added</h3>
        <p>{meme.created_at ? format(new Date(meme.created_at), 'PPP') : 'N/A'}</p>
      </div>
    </div>
  );
};