"use client";

import HandleComponent from "@/components/atoms/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { Description, Radio, RadioGroup } from "@headlessui/react";
import { useRef, useState, useTransition } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import Seperator from "@/components/atoms/Seperator";
import { BASE_PRICE } from "@/app/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, saveConfigArgs } from "./action";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imgURL: string;
  imageDimensions: { width: number; height: number };
}

function DesignConfigurator({
  configId,
  imgURL,
  imageDimensions,
}: DesignConfiguratorProps) {
  const router = useRouter();

  // Initial mounting/loading
  const [isTransitioning, startTransition] = useTransition();

  // TanStack Query manages server state (data from API) — useMutation lets you perform writes (POST/PUT/DELETE); call mutate(data) to trigger the mutationFn, auto-tracks loading/error/success, and runs optional lifecycle callbacks like onSuccess/onError.
  const { mutate: saveConfig, isPending } = useMutation({
    // key to access stored data
    mutationKey: ["save-config"],
    mutationFn: async (args: saveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "There was an error on our end. Please try again.",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.push(`/configure/preview?id=${configId}`);
      });
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const phoneCaseRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    try {
      // get the container position from left of screen
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      // get the phone case position from left of screen
      const {
        left: phoneCaseLeft,
        top: phoneCaseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      // get the phone case position from left of container
      const leftOffset = phoneCaseLeft - containerLeft;
      const topOffset = phoneCaseTop - containerTop;

      // get the picture's position, size with respect to phone case
      const imageX = renderedPosition.x - leftOffset;
      const imageY = renderedPosition.y - topOffset;

      // create a canvas for phone, to save resized and repositioned image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imgURL;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        imageX,
        imageY,
        renderedDimension.width,
        renderedDimension.height
      );

      // to create a blob, so that the file can be created

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], `filename-${Date.now()}.png`, {
        type: "image/png",
      });

      // upload the file to uploadthing
      await startUpload([file], { configId });
    } catch (err) {
      toast.error("Something went wrong", {
        description:
          "There was a problem saving your config, please try again.",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    // blob to byte
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone template"
              src={"/images/phone-template.png"}
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>

          {/* Hover then change the background */}
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          lockAspectRatio
          // set position
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          // set width height
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            // style.width/height : gives in string -> 10px
            setRenderedDimension({
              width: parseInt(ref.style.width.slice(0, -2)),
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className="absolute z-20 ring-[2px] ring-primary"
        >
          <div className="relative w-full h-full">
            <NextImage
              className="pointer-events-none select-none"
              src={imgURL}
              alt="your image"
              fill
            />
          </div>
        </Rnd>
      </div>
      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white items-center lg:items-start mt-8 lg:mt-0">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 top-0 h-12 bg-gradient-to-b from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>

            <Seperator className="my-6" />
            <div className="relative mt-4 h-full flex flex-col sm:flex-row justify-between">
              <div className="flex flex-col gap-6">
                {/* color options */}
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <div key={color.label}>
                        <Radio
                          value={color}
                          className={({ checked }) =>
                            cn(
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                              {
                                [`border-${color.tw}`]: checked,
                              }
                            )
                          }
                        >
                          <span
                            className={cn(
                              `bg-${color.tw}`,
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            )}
                          />
                        </Radio>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {/* model options */}
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* material and finishes options */}
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({ ...prev, [name]: val }));
                      }}
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                { "border-primary": checked }
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm cursor-pointer">
                                <Label className="font-medium text-gray-900 cursor-pointer">
                                  {option.label}
                                </Label>
                                {option.description ? (
                                  <Description
                                    as="span"
                                    className="cursor-pointer text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </Description>
                                ) : null}
                              </span>
                            </span>
                            {/* price */}
                            <Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <Seperator />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full relative justify-center lg:justify-normal flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                size="sm"
                className="cursor-pointer"
                isLoading={isPending || isTransitioning}
                disabled={isPending || isTransitioning}
                loadingText="Saving"
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignConfigurator;
