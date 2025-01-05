interface DescriptionSectionProps {
  description?: string | null;
}

export const DescriptionSection = ({ description }: DescriptionSectionProps) => {
  if (!description) return null;
  
  return (
    <p className="text-lg mb-8 mt-6 break-words whitespace-pre-wrap max-w-full">
      {description}
    </p>
  );
};