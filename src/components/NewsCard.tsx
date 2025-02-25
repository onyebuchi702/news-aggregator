import React from "react";
import { Article } from "@/types";
import Image from "next/image";

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
          width={100}
          height={100}
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h2>
        <p
          className="text-gray-600 mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {article.source}
          </span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </div>
  );
};
