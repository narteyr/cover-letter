"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { HomeLine, Download01, Edit01, File05, Menu02, MessageChatCircle, ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface EditorHeaderProps {
  documentIcon?: React.ComponentType<{ className?: string }>;
  title?: string;
  subtitle?: string;
  onRecommendationsOpen: () => void;
  onDownload: () => void;
  viewMode: "preview" | "edit";
  onViewModeChange: (mode: "preview" | "edit") => void;
  suggestionsCount?: number;
  homeHref?: string;
  showConstraintMeter?: boolean;
}

export default function EditorHeader({
  documentIcon: DocumentIcon = File05,
  title = "Cover Letter",
  subtitle,
  onRecommendationsOpen,
  onDownload,
  viewMode,
  onViewModeChange,
  suggestionsCount = 0,
  homeHref = "/",
  showConstraintMeter = false,
}: EditorHeaderProps) {
  const hasEditBlocked = suggestionsCount > 0;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-12 px-4 border-b border-secondary bg-primary shrink-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link
          href={homeHref}
          aria-label="Back to home"
          className={cx(
            "flex items-center justify-center size-8 rounded-md shrink-0",
            "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
            "transition-colors outline-focus-ring"
          )}
        >
          <HomeLine className="size-5" />
        </Link>
        <div className="h-4 w-px bg-border-secondary shrink-0" />
        <div className="p-1.5 rounded-md bg-utility-blue-50 shrink-0">
          <DocumentIcon className="size-4 text-utility-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-primary truncate">{title}</h1>
          {subtitle && <p className="text-xs text-tertiary truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {showConstraintMeter && <div className="hidden md:flex shrink-0" />}

        <div className="shrink-0">
          <Dropdown.Root>
            <Button
              size="sm"
              color="tertiary"
              aria-label="View mode"
              iconLeading={MessageChatCircle}
              iconTrailing={ChevronDown}
              className="min-w-0"
            />
            <Dropdown.Popover className="w-48">
              <Dropdown.Menu selectionMode="none" disallowEmptySelection={false}>
                <Dropdown.Item icon={File05} onAction={() => onViewModeChange("preview")}>
                  Preview {viewMode === "preview" && "•"}
                </Dropdown.Item>
                <Dropdown.Item
                  icon={Edit01}
                  onAction={() => !hasEditBlocked && onViewModeChange("edit")}
                  isDisabled={hasEditBlocked}
                >
                  Edit{suggestionsCount > 0 ? ` (${suggestionsCount} pending)` : ""}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.Root>
        </div>

        <div className="shrink-0">
          <Dropdown.Root>
            <Dropdown.DotsButton className="p-2" />
            <Dropdown.Popover className="w-56">
              <Dropdown.Menu selectionMode="none" disallowEmptySelection={false}>
                <Dropdown.Item icon={Menu02} onAction={onRecommendationsOpen}>
                  Recommendations
                </Dropdown.Item>
                <Dropdown.Item icon={Download01} onAction={onDownload}>
                  Download PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.Root>
        </div>
      </div>
    </header>
  );
}
