"use client";

import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "../layouts/MaxWidthWrapper";
import { useInView } from "motion/react";
import { PHONES } from "@/app/constants/const";
import { splitArray } from "@/app/utils";
import { cn } from "@/lib/utils";
import Phone from "../atoms/Phone";

type ReviewColumnProps = {
  phoneReviews: string[];
  className?: string;
  phoneReviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
};

interface PhoneReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

// Atom
function PhoneReview({ imgSrc, className, ...props }: PhoneReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-slate-50 p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}

// Molecule
function ReviewColumn({
  phoneReviews,
  className,
  phoneReviewClassName,
  msPerPixel = 0,
}: ReviewColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;
  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {phoneReviews.concat(phoneReviews).map((imgSrc, reviewIndex) => (
        <PhoneReview
          key={reviewIndex}
          imgSrc={imgSrc}
          className={phoneReviewClassName?.(reviewIndex % phoneReviews.length)}
        />
      ))}
    </div>
  );
}

// Organism
function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 
    items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          <ReviewColumn
            phoneReviews={[...column1, ...column3.flat(), ...column2]}
            phoneReviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPixel={10}
          />
          <ReviewColumn
            phoneReviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            phoneReviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            phoneReviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"></div>
    </div>
  );
}

// Organism
function CaseScroller() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/images/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />

      <ReviewGrid />
    </MaxWidthWrapper>
  );
}

export default CaseScroller;
