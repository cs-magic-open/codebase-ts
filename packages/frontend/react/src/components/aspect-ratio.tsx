"use client";

import React, { HTMLAttributes } from "react";
import { useMeasure } from "react-use";

import { cn } from "packages/frontend/frontend-shadcn/src/lib/utils";

export const VerticalAspectRatio = ({
  ratio,
  className,
  style,
  ...props
}: { ratio: number } & HTMLAttributes<HTMLDivElement>) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div
      className={cn("h-full", className)}
      style={{ width: height / ratio, ...style }}
      ref={ref}
      {...props}
    />
  );
};