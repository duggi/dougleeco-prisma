import React from 'react';

interface Props {
  title: string;
  slug: string;
  description: string;
  id: number;
}

export const DougLeeCo: React.FC<Props> = ({
  title,
  slug,
  description,
  id,
}) => {
  return (
    <div key={id} className="shadow  max-w-md  rounded">
      <div className="p-5 flex flex-col space-y-2">
        <p className="text-sm text-blue-500">{title}</p>
        <p className="text-lg font-medium">{slug}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
