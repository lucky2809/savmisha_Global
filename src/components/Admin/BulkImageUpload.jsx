import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlinePhotoLibrary, MdClose } from "react-icons/md";
import { uploadWithProgress } from "../../lib/api";
import { Button, Card, CardHeader, PageHeader } from "./ui";

const MAX_IMAGES = 100;
const MAX_FILE_MB = 10;

export default function BulkImageUpload() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const addFiles = (event) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";

    const oversize = picked.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (oversize.length) {
      toast.error(`${oversize.length} file(s) over ${MAX_FILE_MB}MB were skipped`);
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

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!images.length) {
      toast.error("Select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("mainImages", img));

    setLoading(true);
    setProgress(0);

    try {
      await uploadWithProgress("/images/bulk-upload", formData, setProgress);

      toast.success(
        `${images.length} image${images.length === 1 ? "" : "s"} uploaded`
      );
      setImages([]);
      navigate("/products");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const totalMb = (
    images.reduce((sum, f) => sum + f.size, 0) /
    (1024 * 1024)
  ).toFixed(1);

  return (
    <>
      <PageHeader
        title="Bulk Upload"
        subtitle="Each image becomes its own product. Nothing is posted to social from here."
        action={
          <Button variant="secondary" onClick={() => navigate("/products")}>
            View products
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Images"
          subtitle={
            images.length
              ? `${images.length} of ${MAX_IMAGES} selected · ${totalMb} MB total`
              : `Up to ${MAX_IMAGES} images, ${MAX_FILE_MB}MB each`
          }
          action={
            images.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setImages([])}
                disabled={loading}
                className="px-3 py-1.5 text-xs"
              >
                Clear all
              </Button>
            )
          }
        />

        <div className="p-5">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
            <MdOutlinePhotoLibrary className="h-9 w-9 text-zinc-400" />
            <span className="mt-3 text-sm font-medium text-zinc-700">
              Click to select images
            </span>
            <span className="mt-1 text-xs text-zinc-500">
              You can add more in several goes
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
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {previews.map((url, index) => (
                <div key={url} className="group relative">
                  <img
                    src={url}
                    alt=""
                    className="h-24 w-full rounded-lg border border-zinc-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                    disabled={loading}
                    className="absolute top-1.5 right-1.5 cursor-pointer rounded bg-zinc-900/70 p-1 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                  >
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
          {loading && (
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-zinc-600">
                <span>{progress < 100 ? "Uploading" : "Processing on the server"}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={images.length === 0}
            className="w-full sm:w-auto sm:self-end"
          >
            {loading
              ? "Uploading..."
              : `Upload ${images.length || ""} image${images.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </Card>
    </>
  );
}
