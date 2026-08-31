import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdOutlineCloudUpload,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdCrop,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { uploadWithProgress } from "../../lib/api";
import { Badge, Button, Card, CardHeader, PageHeader } from "./ui";
import SocialToggles from "./SocialToggles";
import { PLATFORMS, useSocialSync } from "../../lib/socialSync";
import ImageEditorModal from "./ImageEditorModal";
import ProductFields from "./ProductFields";

const MIN_IMAGES = 1;
const MAX_IMAGES = 5;
const MAX_FILE_MB = 10;

export default function ImageUpload() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const { sync, toggle } = useSocialSync();
  const navigate = useNavigate();

  // Object URLs must be revoked or every re-selection leaks a blob.
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const addFiles = (event) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = ""; // allow re-picking the same file after a remove

    const tooBig = picked.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig.length) {
      toast.error(`${tooBig.length} file(s) exceed ${MAX_FILE_MB}MB and were skipped`);
    }

    const accepted = picked.filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_FILE_MB * 1024 * 1024
    );

    if (images.length + accepted.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    if (accepted.length) setImages((prev) => [...prev, ...accepted]);
  };

  const applyEdit = (editedFile) => {
    setImages((prev) =>
      prev.map((file, i) => (i === editingIndex ? editedFile : file))
    );
    setEditingIndex(null);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setMainIndex((prev) => {
      if (index === prev) return 0;
      return index < prev ? prev - 1 : prev;
    });
  };

  // The old version let this run on an empty array, which posted the literal
  // string "undefined" as mainImage and came back as a confusing 400.
  const validationError =
    images.length < MIN_IMAGES
      ? `Select at least ${MIN_IMAGES} image`
      : !description.trim()
        ? "Add a description - it becomes the social media caption"
        : "";

  const handleSubmit = async () => {
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("mainImage", images[mainIndex]);
    images.forEach((img, i) => {
      if (i !== mainIndex) formData.append("otherImages", img);
    });
    formData.append("description", description.trim());
    formData.append("postToFacebook", String(sync.facebook));
    formData.append("postToInstagram", String(sync.instagram));
    formData.append("serialNumber", serialNumber.trim());
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("colors", JSON.stringify(colors));

    setLoading(true);
    setProgress(0);
    setResult(null);

    try {
      const data = await uploadWithProgress("/images/upload", formData, setProgress);

      setResult(data);
      setImages([]);
      setMainIndex(0);
      setDescription("");
      setSerialNumber("");
      setSizes([]);
      setColors([]);

      const social = data?.social ?? data?.data?.socialStatus;
      const requested = PLATFORMS.filter((p) => sync[p.key]);

      if (!requested.length) {
        toast.success("Product saved. Sync it to social from Overview whenever you like.");
      } else {
        const succeeded = requested.filter(
          (p) => social?.[p.key]?.id || social?.[p.key]?.status === "posted"
        );

        if (succeeded.length === requested.length) {
          toast.success(
            `Product uploaded and posted to ${succeeded.map((p) => p.label).join(" and ")}`
          );
        } else if (succeeded.length) {
          toast.warning(
            `Uploaded, but only ${succeeded.map((p) => p.label).join(" and ")} succeeded`
          );
        } else {
          toast.warning("Product uploaded, but the social posts failed");
        }
      }
    } catch (err) {
      // Surface the server's actual message instead of a blanket "Upload Failed".
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const social = result?.social ?? result?.data?.socialStatus;

  return (
    <>
      <PageHeader
        title="Upload Product"
        subtitle="Crop images before uploading, and choose where the post goes."
        action={
          <Button variant="secondary" onClick={() => navigate("/products")}>
            View products
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Images"
              subtitle={`${images.length} of ${MAX_IMAGES} selected · click a thumbnail to set the main image, or crop it`}
            />

            <div className="p-5">
              <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-zinc-400 hover:bg-zinc-100"
              >
                <MdOutlineCloudUpload className="h-9 w-9 text-zinc-400" />
                <span className="mt-3 text-sm font-medium text-zinc-700">
                  Click to select images
                </span>
                <span className="mt-1 text-xs text-zinc-500">
                  JPG or PNG · up to {MAX_FILE_MB}MB each · max {MAX_IMAGES} images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={addFiles}
                  disabled={loading}
                  className="hidden"
                />
              </label>

              {previews.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {previews.map((url, index) => (
                    <div key={url} className="group relative">
                      <button
                        type="button"
                        onClick={() => setMainIndex(index)}
                        className={`block w-full cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                          mainIndex === index
                            ? "border-emerald-500 ring-2 ring-emerald-100"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <img src={url} alt="" className="h-28 w-full object-cover" />
                      </button>

                      {mainIndex === index && (
                        <span className="absolute top-1.5 left-1.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          MAIN
                        </span>
                      )}

                      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(index)}
                          aria-label="Crop image"
                          title="Crop, zoom or rotate"
                          disabled={loading}
                          className="cursor-pointer rounded bg-zinc-900/70 p-1 text-white transition hover:bg-zinc-900"
                        >
                          <MdCrop className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                          disabled={loading}
                          className="cursor-pointer rounded bg-zinc-900/70 p-1 text-white transition hover:bg-red-600"
                        >
                          <MdClose className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <ProductFields
              serialNumber={serialNumber}
              onSerialChange={setSerialNumber}
              sizes={sizes}
              onSizesChange={setSizes}
              colors={colors}
              onColorsChange={setColors}
              disabled={loading}
            />
          </Card>

          <Card>
            <CardHeader
              title="Description"
              subtitle="Used as the caption on Facebook and Instagram."
            />
            <div className="p-5">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                disabled={loading}
                placeholder="Describe the product..."
                className="w-full resize-none rounded-lg border border-zinc-300 p-3 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none disabled:bg-zinc-50"
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                {description.trim().length} characters
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Social sync"
              subtitle="Where this product gets posted"
            />
            <div className="p-5">
              <SocialToggles sync={sync} onToggle={toggle} disabled={loading} />
            </div>
          </Card>

          <Card className="lg:sticky lg:top-24">
            <CardHeader title="Publish" />
            <div className="space-y-4 p-5">
              {validationError && !loading && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200 ring-inset">
                  {validationError}
                </p>
              )}

              {loading && (
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-zinc-600">
                    <span>{progress < 100 ? "Uploading" : "Processing & posting"}</span>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress === 100 && (
                    <p className="mt-2 text-xs text-zinc-500">
                      Optimising images and posting to social - this can take a while.
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={Boolean(validationError)}
                className="w-full"
              >
                {loading ? "Uploading..." : "Upload product"}
              </Button>
            </div>
          </Card>

          {social && (
            <Card>
              <CardHeader title="Last upload result" />
              <div className="space-y-3 p-5">
                {PLATFORMS.map(({ key, label }) => {
                  const entry = social[key];
                  const ok = entry?.id || entry?.status === "posted";
                  const skipped = entry?.skipped || entry?.status === "skipped";

                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-800">
                          {label}
                        </span>

                        {skipped ? (
                          <Badge tone="neutral">
                            <MdRemoveCircleOutline className="h-3.5 w-3.5" />
                            Turned off
                          </Badge>
                        ) : (
                          <Badge tone={ok ? "success" : "danger"}>
                            {ok ? (
                              <MdCheckCircle className="h-3.5 w-3.5" />
                            ) : (
                              <MdCancel className="h-3.5 w-3.5" />
                            )}
                            {ok ? "Posted" : "Failed"}
                          </Badge>
                        )}
                      </div>

                      {!ok && !skipped && entry?.error && (
                        <p className="mt-1 text-xs break-words text-red-600">
                          {entry.error}
                        </p>
                      )}
                    </div>
                  );
                })}

                {Array.isArray(result?.social?.imageCheck) &&
                  result.social.imageCheck.some((c) => !c.ok) && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 ring-inset">
                      Some image URLs were not publicly reachable, so Meta could not
                      fetch them. Check PUBLIC_BASE_URL on the server.
                    </p>
                  )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {editingIndex !== null && (
        <ImageEditorModal
          file={images[editingIndex]}
          onCancel={() => setEditingIndex(null)}
          onApply={applyEdit}
        />
      )}
    </>
  );
}
