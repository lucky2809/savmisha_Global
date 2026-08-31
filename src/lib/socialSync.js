import { useCallback, useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const STORAGE_KEY = "dashboard:social-sync";

export const PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    field: "postToFacebook",
    Icon: FaFacebook,
    activeClass: "text-[#1877F2]",
  },
  {
    key: "instagram",
    label: "Instagram",
    field: "postToInstagram",
    Icon: FaInstagram,
    activeClass: "text-[#E1306C]",
  },
];

const DEFAULTS = { facebook: true, instagram: true };

/**
 * Remembers the admin's last choice, so someone who always posts to Facebook
 * only is not re-ticking the same boxes on every upload.
 */
export function useSocialSync() {
  const [sync, setSync] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sync));
    } catch {
      // storage disabled - the choice just won't persist
    }
  }, [sync]);

  const toggle = useCallback(
    (key) => setSync((prev) => ({ ...prev, [key]: !prev[key] })),
    []
  );

  return { sync, toggle, setSync };
}
