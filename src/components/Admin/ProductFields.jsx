import { useState } from "react";
import { MdClose, MdAdd } from "react-icons/md";
import { SIZE_OPTIONS } from "../../lib/catalog";
import { CardHeader } from "./ui";

/**
 * Serial number, sizes and colours. Shared by the create and edit screens so
 * the two cannot drift apart.
 */
export default function ProductFields({
  serialNumber,
  onSerialChange,
  sizes,
  onSizesChange,
  colors,
  onColorsChange,
  disabled,
}) {
  const [colorDraft, setColorDraft] = useState("");

  const toggleSize = (size) =>
    onSizesChange(
      sizes.includes(size) ? sizes.filter((s) => s !== size) : [...sizes, size]
    );

  const allSelected = sizes.length === SIZE_OPTIONS.length;

  // One control that flips meaning: select every size, or clear the lot.
  const toggleAllSizes = () =>
    onSizesChange(allSelected ? [] : [...SIZE_OPTIONS]);

  const addColor = () => {
    const value = colorDraft.trim();
    if (!value) return;

    // Case-insensitive dedupe, matching what the backend stores.
    if (colors.some((c) => c.toLowerCase() === value.toLowerCase())) {
      setColorDraft("");
      return;
    }

    onColorsChange([...colors, value]);
    setColorDraft("");
  };

  const handleColorKey = (e) => {
    // Enter and comma both commit; Backspace on an empty field removes the last.
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addColor();
    } else if (e.key === "Backspace" && !colorDraft && colors.length) {
      onColorsChange(colors.slice(0, -1));
    }
  };

  return (
    <>
      <CardHeader
        title="Product details"
        subtitle="Serial number is admin-only; sizes and colours are shown to customers."
      />

      <div className="space-y-5 p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Serial number
          </span>
          <input
            value={serialNumber}
            onChange={(e) => onSerialChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. SM-1042"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none disabled:bg-zinc-50"
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Shown on the product detail page and copied onto every order line.
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-700">
              Available sizes
              {sizes.length > 0 && (
                <span className="ml-1.5 font-normal text-zinc-400">
                  {sizes.length}/{SIZE_OPTIONS.length}
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={toggleAllSizes}
              disabled={disabled}
              className="cursor-pointer text-xs font-medium text-zinc-500 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allSelected ? "Clear all" : "Select all"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => {
              const on = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  disabled={disabled}
                  aria-pressed={on}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    on
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {sizes.length === 0 && (
            <p className="mt-1.5 text-xs text-zinc-500">
              None selected - customers will not be able to order this product.
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Colours
          </span>

          {colors.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-50 py-1 pr-1 pl-3 text-xs font-medium text-zinc-700"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() =>
                      onColorsChange(colors.filter((c) => c !== color))
                    }
                    disabled={disabled}
                    aria-label={`Remove ${color}`}
                    className="cursor-pointer rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
                  >
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={colorDraft}
              onChange={(e) => setColorDraft(e.target.value)}
              onKeyDown={handleColorKey}
              onBlur={addColor}
              disabled={disabled}
              placeholder="Type a colour and press Enter"
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none disabled:bg-zinc-50"
            />
            <button
              type="button"
              onClick={addColor}
              disabled={disabled || !colorDraft.trim()}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdAdd className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
