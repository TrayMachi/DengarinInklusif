import React from "react";
import { useLoaderData } from "react-router";
import type { FlashcardPage } from "./loader";

export const Flashcard = () => {
  const loaderData = useLoaderData<FlashcardPage[]>();
  return (
    <div>
      {loaderData.map((page) => (
        <div key={page.id}>
          <h1>{page.question}</h1>
          <p>{page.answer}</p>
        </div>
      ))}
    </div>
  );
};
