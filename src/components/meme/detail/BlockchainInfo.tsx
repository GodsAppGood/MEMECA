interface BlockchainInfoProps {
  blockchain?: string | null;
}

export const BlockchainInfo = ({ blockchain }: BlockchainInfoProps) => {
  if (!blockchain) return null;

  return (
    <div>
      <h3 className="font-serif text-lg mb-2">Blockchain</h3>
      <p className="capitalize">{blockchain}</p>
    </div>
  );
};