import type { Options } from "@splidejs/react-splide";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { classNames } from "~/lib/classNames";

export interface CarouselImage {
  src: StaticImageData;
  alt: string;
  description?: string;
}

export interface CarouselProps {
  images: CarouselImage[];
  label: string;
  className?: string;
  hideThumbnails?: boolean;
  loop?: boolean;
}

const MAIN_OPTIONS: Options = {
  perMove: 1,
  gap: "1rem",
  pagination: false,
};

const THUMBNAILS_OPTIONS: Options = {
  type: "slide",
  rewind: true,
  gap: "1rem",
  pagination: false,
  fixedWidth: 110,
  fixedHeight: 70,
  cover: true,
  focus: "center",
  isNavigation: true,
};

export default function Carousel({
  images,
  label,
  className,
  hideThumbnails = false,
  loop = false,
}: CarouselProps) {
  const mainRef = useRef<Splide>(null);
  const thumbnailsRef = useRef<Splide>(null);

  useEffect(() => {
    if (hideThumbnails) {
      return;
    }

    if (mainRef.current && thumbnailsRef.current && thumbnailsRef.current.splide) {
      mainRef.current.sync(thumbnailsRef.current.splide);
    }
  }, [hideThumbnails]);

  return (
    <div className={classNames(className)}>
      <Splide ref={mainRef} options={{ ...MAIN_OPTIONS, ...(loop && { type: "loop" }) }} aria-label={label}>
        {images.map((image) => (
          <SplideSlide key={image.src.src}>
            <Image src={image.src} alt={image.alt} />
            {image.description && <div className="mt-9 text-center">{image.description}</div>}
          </SplideSlide>
        ))}
      </Splide>
      {!hideThumbnails && (
        <Splide ref={thumbnailsRef} options={THUMBNAILS_OPTIONS}>
          {images.map((image) => (
            <SplideSlide key={image.src.src}>
              <Image src={image.src} alt={image.alt} />
            </SplideSlide>
          ))}
        </Splide>
      )}
    </div>
  );
}
