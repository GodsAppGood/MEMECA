import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { validateBlockchain } from "@/utils/validation";
import { useState } from "react";

interface BlockchainSelectorProps {
  blockchain: string;
  setBlockchain: (value: string) => void;
}

export const BlockchainSelector = ({ blockchain, setBlockchain }: BlockchainSelectorProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleBlockchainChange = (value: string) => {
    setBlockchain(value);
    const validationError = validateBlockchain(value);
    setError(validationError);
  };

  const blockchains = [
    "Solana", "Ethereum", "Polygon", "Ton", "BSC", "Base", "Arbitrum", 
    "Avalanche", "Hyperliquid", "Optimism", "Sui", "Celo", "Osmosis", 
    "Pulsechain", "Blast", "Mantle", "Aptos", "Linea", "Sei", "Starknet", 
    "Chronos", "Fantom", "Tron", "Hedera", "Zksync", "Gnosis", "Scroll", 
    "Cordano", "Near", "Manta", "Injective", "Zora"
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-serif">Select Blockchain</label>
      <Select value={blockchain} onValueChange={handleBlockchainChange}>
        <SelectTrigger className={`w-full font-serif ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select blockchain" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {blockchains.map((chain) => (
            <SelectItem 
              key={chain.toLowerCase()} 
              value={chain.toLowerCase()}
              className="font-serif"
            >
              {chain}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};