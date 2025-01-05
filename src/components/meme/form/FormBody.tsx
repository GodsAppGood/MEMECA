import React from 'react';
import { ImageUploader } from "../ImageUploader";
import { FormFields } from "../FormFields";
import { BlockchainSelector } from "../BlockchainSelector";
import { DateSelector } from "../DateSelector";

interface FormBodyProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  blockchain: string;
  setBlockchain: (value: string) => void;
  createdAt: Date | undefined;
  setCreatedAt: (date: Date | undefined) => void;
  twitterLink: string;
  setTwitterLink: (value: string) => void;
  telegramLink: string;
  setTelegramLink: (value: string) => void;
  tradeLink: string;
  setTradeLink: (value: string) => void;
}

export const FormBody = ({
  imageUrl,
  setImageUrl,
  title,
  setTitle,
  description,
  setDescription,
  blockchain,
  setBlockchain,
  createdAt,
  setCreatedAt,
  twitterLink,
  setTwitterLink,
  telegramLink,
  setTelegramLink,
  tradeLink,
  setTradeLink,
}: FormBodyProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <ImageUploader imageUrl={imageUrl} onImageChange={setImageUrl} />
      </div>

      <div className="space-y-6">
        <FormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          maxDescriptionLength={200}
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
      </div>
    </div>
  );
};