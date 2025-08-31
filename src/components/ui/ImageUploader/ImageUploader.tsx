import * as SliderPrimitive from "@radix-ui/react-slider";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Button, Dialog, DialogClose, DialogContent, DialogTrigger } from "~/components/ui";

type ReadAsMethod = "readAsText" | "readAsDataURL" | "readAsArrayBuffer" | "readAsBinaryString";

type UseFileReaderProps = {
  method: ReadAsMethod;
  onLoad?: (result: unknown) => void;
};

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const MAX_IMAGE_SIZE = 512;

const useFileReader = (options: UseFileReaderProps) => {
  const { method = "readAsText", onLoad } = options;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DOMException | null>(null);
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (!file && result) {
      setResult(null);
    }
  }, [file, result]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => setLoading(false);
    reader.onerror = () => setError(reader.error);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      setResult(e.target?.result ?? null);
      if (onLoad) {
        onLoad(e.target?.result ?? null);
      }
    };
    reader[method](file);
  }, [file, method, onLoad]);

  return [{ result, error, file, loading }, setFile] as const;
};

type ImageUploaderProps = {
  id?: string;
  buttonMsg: string;
  handleAvatarChange: (imageSrc: string) => void;
  imageSrc?: string;
  target: string;
};

interface FileEvent<T = Element> extends FormEvent<T> {
  target: EventTarget & T;
}

// This is separate to prevent loading the component until file upload
function CropContainer({
  onCropComplete,
  imageSrc,
}: {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleZoomSliderChange = (value: number) => {
    value < 1 ? setZoom(1) : setZoom(value);
  };

  return (
    <div className="h-80 max-h-80 w-80 rounded-full">
      <div className="relative h-80 w-80 rounded-full">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={(_croppedArea, croppedAreaPixels) => onCropComplete(croppedAreaPixels)}
          onZoomChange={setZoom}
        />
      </div>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        label="Slide to zoom, drag to reposition"
        changeHandler={handleZoomSliderChange}
      />
    </div>
  );
}

export default function ImageUploader({
  target,
  id,
  buttonMsg,
  handleAvatarChange,
  ...props
}: ImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [{ result }, setFile] = useFileReader({
    method: "readAsDataURL",
  });

  useEffect(() => {
    if (props.imageSrc) setImageSrc(props.imageSrc);
  }, [props.imageSrc]);

  const onInputFile = (e: FileEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }
    setFile(e.target.files[0] ?? null);
  };

  const showCroppedImage = useCallback(
    async (croppedAreaPixels: Area | null) => {
      try {
        if (!croppedAreaPixels) return;
        const croppedImage = await getCroppedImg(
          result as string /* result is always string when using readAsDataUrl */,
          croppedAreaPixels
        );
        setImageSrc(croppedImage);
        handleAvatarChange(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [result, handleAvatarChange]
  );

  return (
    <Dialog
      onOpenChange={
        (opened) => !opened && setFile(null) // unset file on close
      }>
      <DialogTrigger asChild>
        <Button type="button" size="xs">
          {buttonMsg}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-200">
        <div className="mb-4 sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="font-cal text-emphasis text-xl leading-6 underline decoration-gray-500">
              Upload profile picture
            </h3>
          </div>
        </div>
        <div className="mb-4">
          <div className="mt-6 flex flex-col items-center justify-center p-8">
            {!result && (
              <div className="bg-muted flex h-20 max-h-20 w-20 items-center justify-start rounded-full">
                {!imageSrc && (
                  <p className="text-emphasis w-full text-center text-sm sm:text-xs">No file selected</p>
                )}
                {imageSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="h-20 w-20 rounded-full" src={imageSrc} alt={target} />
                )}
              </div>
            )}
            {result && <CropContainer imageSrc={result as string} onCropComplete={setCroppedAreaPixels} />}
            <label className="mt-8 rounded-xl border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-medium leading-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1">
              <input
                onInput={onInputFile}
                type="file"
                name={id}
                placeholder="Upload image"
                className="text-default pointer-events-none absolute mt-4 opacity-0 "
                accept="image/*"
              />
              Choose a file...
            </label>
          </div>
        </div>
        <div className="mt-5 flex flex-row-reverse gap-x-2 sm:mt-4">
          <DialogClose
            color="secondary"
            onClick={() => {
              if (!result) {
                return;
              }
              void showCroppedImage(croppedAreaPixels);
            }}>
            Save
          </DialogClose>
          <DialogClose className="bg-gray-500 hover:bg-gray-600">Cancel</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Context is null, this should never happen.");

  const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
  const resizeRatio = MAX_IMAGE_SIZE / maxSize < 1 ? Math.max(MAX_IMAGE_SIZE / maxSize, 0.75) : 1;
  // huh, what? - Having this turned off actually improves image quality as otherwise anti-aliasing is applied
  // this reduces the quality of the image overall because it anti-aliases the existing, copied image; blur results
  ctx.imageSmoothingEnabled = false;
  // pixelCrop is always 1:1 - width = height
  canvas.width = canvas.height = Math.min(maxSize * resizeRatio, pixelCrop.width);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // on very low ratios, the quality of the resize becomes awful. For this reason the resizeRatio is limited to 0.75
  if (resizeRatio <= 0.75) {
    // With a smaller image, thus improved ratio. Keep doing this until the resizeRatio > 0.75.
    return getCroppedImg(canvas.toDataURL("image/png"), {
      width: canvas.width,
      height: canvas.height,
      x: 0,
      y: 0,
    });
  }

  return canvas.toDataURL("image/png");
}

const Slider = ({
  value,
  label,
  changeHandler,
  ...props
}: Omit<SliderPrimitive.SliderProps, "value"> & {
  value: number;
  label: string;
  changeHandler: (value: number) => void;
}) => (
  <SliderPrimitive.Root
    className="relative mt-2 flex h-4 w-40 select-none items-center"
    value={[value]}
    aria-label={label}
    onValueChange={(value) => {
      value[0] && changeHandler(value[0]);
    }}
    {...props}>
    <SliderPrimitive.Track className="relative h-1 flex-grow rounded-md bg-gray-400">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gray-700" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3 w-3 cursor-pointer rounded-full bg-gray-700 transition-all hover:bg-gray-600 focus:shadow" />
  </SliderPrimitive.Root>
);
