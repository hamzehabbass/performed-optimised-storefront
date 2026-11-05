"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const image = images[activeIndex] ?? images[0];

  function move(direction: number) {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div>
      <div
        className="product-gallery-main"
        role="region"
        aria-label={`${title} image gallery`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX;
          if (touchStart === null || end === undefined) return;
          if (Math.abs(end - touchStart) > 40) move(end < touchStart ? 1 : -1);
          setTouchStart(null);
        }}
      >
        {image && (
          <Image
            src={image}
            alt={`${title}, image ${activeIndex + 1} of ${images.length}`}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 52vw"
            className="object-contain p-8 sm:p-12"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:mt-4 sm:gap-3">
          {images.slice(0, 5).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={`relative aspect-square overflow-hidden rounded-lg bg-soft ${
                activeIndex === index ? "ring-2 ring-olive ring-offset-2 ring-offset-surface" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={activeIndex === index}
            >
              <Image src={src} alt="" fill sizes="100px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Image {activeIndex + 1} of {images.length}
      </p>
    </div>
  );
}
