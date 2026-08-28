"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useUrlSyncedProject(projectIds: string[]): {
  openId: string | null;
  setOpenId: (id: string | null) => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [internalId, setInternalId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const param = searchParams.get("project");
    if (param && projectIds.includes(param)) {
      setInternalId(param);
    } else if (!param) {
      setInternalId(null);
    }
  }, [mounted, searchParams, projectIds]);

  const setOpenId = (id: string | null) => {
    setInternalId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("project", id);
    } else {
      params.delete("project");
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  return { openId: mounted ? internalId : null, setOpenId };
}
