"use client"

import { useRef } from "react";
import MaxWidthWrapper from "../layouts/MaxWidthWrapper";
import { useInView } from "motion/react";
import { PHONES } from "@/app/constants/const";
import { splitArray } from "@/app/utils";

// Molecule
function ReviewColumn() {
  return (
    <></>
  )
}

// Organism
function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 })

  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);
  
  return (
    <div ref={containerRef} className="relative -mx-4 mt-16 grid h-[49rem] border-gray-900 max-h-[150vh] grid-cols-1 
    items-start gap-8 overflow-hidden px-4 sm:m-20 md:grid-cols-2 lg:grid-cols-3">
      {
        isInView ? (
          <>
            <ReviewColumn/>
          </>
        ) : null
      }
    </div>
  )
}

// Organism
function CaseScroller() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img aria-hidden = "true" src="/images/what-people-are-buying.png" alt="product pictures" className="absolute hidden xl:block -left-32 top-1/3" />
      <ReviewGrid/>
    </MaxWidthWrapper>
  )
}

export default CaseScroller