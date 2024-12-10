import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlockchainSelectorProps {
  blockchain: string;
  setBlockchain: (value: string) => void;
}

export const BlockchainSelector = ({ blockchain, setBlockchain }: BlockchainSelectorProps) => {
  const blockchains = [
    "Solana", "Ethereum", "Polygon", "Ton", "BSC", "Base", "Arbitrum", 
    "Avalanche", "Hyperliquid", "Optimism", "Sui", "Celo", "Osmosis", 
    "Pulsechain", "Blast", "Mantle", "Aptos", "Linea", "Sei", "Starknet", 
    "Chronos", "Fantom", "Tron", "Hedera", "Zksync", "Gnosis", "Scroll", 
    "Cordano", "Near", "Manta", "Injective", "Zora"
  ];

  return (
    <div>
      <label className="block text-sm font-serif mb-2">Blockchain</label>
      <Select value={blockchain} onValueChange={setBlockchain}>
        <SelectTrigger className="w-full font-serif bg-white">
          <SelectValue placeholder="Select blockchain" />
        </SelectTrigger>
        <SelectContent className="bg-white">
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
    </div>
  );
};