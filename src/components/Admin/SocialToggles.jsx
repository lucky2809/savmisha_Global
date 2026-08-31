import { PLATFORMS } from "../../lib/socialSync";

function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900
        disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? "bg-zinc-900" : "bg-zinc-300"}`}
    >
      <span
        className={`pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function SocialToggles({ sync, onToggle, disabled }) {
  const noneSelected = !sync.facebook && !sync.instagram;

  return (
    <div className="space-y-3">
      {PLATFORMS.map((platform) => {
        const Icon = platform.Icon;
        const on = sync[platform.key];

        return (
          <div key={platform.key} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <Icon
                className={`h-5 w-5 transition ${
                  on ? platform.activeClass : "text-zinc-300"
                }`}
              />
              <span
                className={`text-sm font-medium ${on ? "text-zinc-900" : "text-zinc-400"}`}
              >
                {platform.label}
              </span>
            </span>

            <Switch
              checked={on}
              onChange={() => onToggle(platform.key)}
              disabled={disabled}
            />
          </div>
        );
      })}

      <p className="text-xs text-zinc-500">
        {noneSelected
          ? "Nothing will be posted. The product is still saved and you can sync it later from Overview."
          : "Posted right after the product is saved."}
      </p>
    </div>
  );
}
