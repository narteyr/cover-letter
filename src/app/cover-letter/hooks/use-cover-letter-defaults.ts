"use client";

import { useMemo } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { CoverLetterFormData } from "../components/cover-letter-info-modal";

/**
 * Derives default cover letter form values from available data sources
 * (auth user), in priority order.
 *
 * Everything is optional — the user can still edit before generating.
 */
export function useCoverLetterDefaults(): Partial<CoverLetterFormData> {
  const { user } = useAuth();

  return useMemo(() => {
    return {
      candidateName: user?.displayName ?? "",
      candidateEmail: user?.email ?? "",
      candidatePhone: user?.phoneNumber ?? "",
      candidateAddress: "",
      yearsOfExperience: "",
      topAchievements: "",
      relevantSkills: "",
    };
  }, [user]);
}
