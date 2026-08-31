import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineAddPhotoAlternate, MdClose } from "react-icons/md";
import { api, assetUrl } from "../../lib/api";
import {
  Button,
  Card,
  CardHeader,
  ErrorState,
  PageHeader,
  Skeleton,
} from "./ui";

const MAX_IMAGES = 5;

export default function UpdateProductImages() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  // Object URLs created for newly picked files, revoked on unmount.
  const objectUrls = useRef([]);

  const fetchProduct = useCallback(async () => {
    setFetching(true);
    setError("");

    try {
      const res = await api.get(`/images/${id}`);
      const data = res?.data;

      if (!data) throw new Error("Product not found");

      const formatted = [
        {
          url: assetUrl(data.mainImage),
          path: data.mainImage,
          file: null,
          isNew: false,
        },
        ...(data.otherImages ?? []).map((img) => ({
          url: assetUrl(img),
          path: img,
          file: null,
          isNew: false,
        })),
      ];

      setImages(formatted);
      setMainIndex(0);
      setDescription(typeof data.description === "string" ? data.description : "");
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const handleImages = (event) => {
    const files = Array.from(event.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    event.target.value = "";

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const added = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { file, url, path: null, isNew: true };
    });

    setImages((prev) => [...prev, ...added]);
  };

  const removeImage = async (index) => {
    const img = images[index];

    // Removing a saved image deletes it on the server straight away, so it
    // needs confirming - the old version deleted on a single stray click.
    if (!img.isNew && !window.confirm("Delete this image permanently?")) {
      return;
    }

    try {
      if (!img.isNew) {
        await api.put(`/images/update-action/${id}`, { deleteImage: img.path });
      }

      setImages((prev) => prev.filter((_, i) => i !== index));
      setMainIndex((prev) => {
        if (index === prev) return 0;
        return index < prev ? prev - 1 : prev;
      });
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const setMain = async (index) => {
    const img = images[index];

    try {
      if (!img.isNew) {
        await api.put(`/images/update-action/${id}`, { setMain: img.path });
      }
      setMainIndex(index);
    } catch (err) {
      toast.error(err.message || "Could not set the main image");
    }
  };

  const handleUpdate = async () => {
    if (!images.length) {
      toast.error("A product needs at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);

    const mainImage = images[mainIndex];
    if (mainImage?.isNew) {
      formData.append("mainImage", mainImage.file);
    }

    images.forEach((img, i) => {
      if (i !== mainIndex && img.isNew) {
        formData.append("otherImages", img.file);
      }
    });

    setLoading(true);

    try {
      await api.put(`/images/update-images/${id}`, formData);

      toast.success("Product updated");

      if (fileInputRef.current) fileInputRef.current.value = "";
      navigate("/products");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <>
        <PageHeader title="Edit Product" />
        <ErrorState message={error} onRetry={fetchProduct} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Product"
        subtitle="Removing a saved image deletes it from the server immediately."
        action={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Images"
              subtitle={
                fetching
                  ? "Loading..."
                  : `${images.length} of ${MAX_IMAGES} · click a thumbnail to make it the main image`
              }
            />

            <div className="p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
                <MdOutlineAddPhotoAlternate className="h-8 w-8 text-zinc-400" />
                <span className="mt-2 text-sm font-medium text-zinc-700">
                  Add more images
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  disabled={loading || fetching}
                  className="hidden"
                />
              </label>

              {fetching ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                images.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {images.map((img, index) => (
                      <div key={img.url} className="group relative">
                        <button
                          type="button"
                          onClick={() => setMain(index)}
                          className={`block w-full cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                            mainIndex === index
                              ? "border-emerald-500 ring-2 ring-emerald-100"
                              : "border-zinc-200 hover:border-zinc-400"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="h-28 w-full object-cover"
                          />
                        </button>

                        {mainIndex === index && (
                          <span className="absolute top-1.5 left-1.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            MAIN
                          </span>
                        )}

                        {img.isNew && (
                          <span className="absolute bottom-1.5 left-1.5 rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            NEW
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                          className="absolute top-1.5 right-1.5 cursor-pointer rounded bg-zinc-900/70 p-1 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                        >
                          <MdClose className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Description" />
            <div className="p-5">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={loading || fetching}
                placeholder="Enter product description..."
                className="w-full resize-none rounded-lg border border-zinc-300 p-3 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none disabled:bg-zinc-50"
              />
            </div>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader title="Save" />
          <div className="p-5">
            <Button
              onClick={handleUpdate}
              loading={loading}
              disabled={fetching || images.length === 0}
              className="w-full"
            >
              {loading ? "Updating..." : "Update product"}
            </Button>
            <p className="mt-3 text-xs text-zinc-500">
              Only newly added images are uploaded. Existing ones are already saved.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
