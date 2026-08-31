import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import {
  MdClose,
  MdRotateLeft,
  MdRotateRight,
  MdRestartAlt,
  MdCrop,
} from "react-icons/md";
import { Button } from "./ui";

const ASPECTS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1, hint: "Instagram square" },
  { label: "4:5", value: 4 / 5, hint: "Instagram portrait" },
  { label: "16:9", value: 16 / 9, hint: "Wide" },
];

/**
 * Renders the cropped region to a canvas at the source image's own resolution,
 * so cropping does not silently downscale the upload.
 */
async function renderCrop(imageSrc, cropPixels, rotation, mimeType, quality = 0.92) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Could not read image")));
    img.src = imageSrc;
  });

  const radians = (rotation * Math.PI) / 180;

  // Rotating happens on a scratch canvas big enough to hold the rotated image,
  // then the crop rectangle is lifted out of that.
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const boxWidth = image.width * cos + image.height * sin;
  const boxHeight = image.width * sin + image.height * cos;

  const scratch = document.createElement("canvas");
  scratch.width = boxWidth;
  scratch.height = boxHeight;

  const scratchCtx = scratch.getContext("2d");
  scratchCtx.translate(boxWidth / 2, boxHeight / 2);
  scratchCtx.rotate(radians);
  scratchCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const output = document.createElement("canvas");
  output.width = Math.round(cropPixels.width);
  output.height = Math.round(cropPixels.height);

  const ctx = output.getContext("2d");

  // JPEG has no alpha; without this a transparent PNG turns black.
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, output.width, output.height);
  }

  ctx.drawImage(
    scratch,
    Math.round(cropPixels.x),
    Math.round(cropPixels.y),
    Math.round(cropPixels.width),
    Math.round(cropPixels.height),
    0,
    0,
    Math.round(cropPixels.width),
    Math.round(cropPixels.height)
  );

  const blob = await new Promise((resolve) =>
    output.toBlob(resolve, mimeType, quality)
  );

  if (!blob) throw new Error("Could not render the cropped image");
  return blob;
}

export default function ImageEditorModal({ file, onCancel, onApply }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Derived rather than set from an effect, which would cost an extra render.
  const src = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(
    () => () => {
      if (src) URL.revokeObjectURL(src);
    },
    [src]
  );

  // Escape closes, matching every other modal on the web.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCropPixels(areaPixels);
  }, []);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleApply = async () => {
    if (!cropPixels) return;

    setSaving(true);
    setError("");

    try {
      // PNG is kept as PNG so logos with transparency survive; anything else
      // is written as JPEG, which is what Instagram wants anyway.
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await renderCrop(src, cropPixels, rotation, mimeType);

      const extension = mimeType === "image/png" ? "png" : "jpg";
      const baseName = file.name.replace(/\.[^.]+$/, "");

      onApply(
        new File([blob], `${baseName}-edited.${extension}`, {
          type: mimeType,
          lastModified: Date.now(),
        })
      );
    } catch (err) {
      setError(err.message || "Could not save the edit");
      setSaving(false);
    }
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <MdCrop className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Edit image</h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close editor"
            className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[45vh] min-h-[260px] bg-zinc-900">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect ?? undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              restrictPosition={false}
            />
          )}
        </div>

        <div className="space-y-4 overflow-y-auto border-t border-zinc-200 px-5 py-4">
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setAspect(option.value)}
                  title={option.hint}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    aspect === option.value
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-500">
                Zoom
              </span>
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </label>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-zinc-500">
                Rotate
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation((r) => r - 90)}
                  aria-label="Rotate left"
                  className="cursor-pointer rounded-lg border border-zinc-300 p-2 text-zinc-600 transition hover:bg-zinc-50"
                >
                  <MdRotateLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => r + 90)}
                  aria-label="Rotate right"
                  className="cursor-pointer rounded-lg border border-zinc-300 p-2 text-zinc-600 transition hover:bg-zinc-50"
                >
                  <MdRotateRight className="h-4 w-4" />
                </button>
                <button
                  onClick={reset}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                >
                  <MdRestartAlt className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 ring-inset">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-3.5">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleApply} loading={saving} disabled={!cropPixels}>
            Apply crop
          </Button>
        </div>
      </div>
    </div>
  );
}
