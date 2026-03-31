"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  Building2,
  User as UserIcon,
  Edit,
  Archive,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { archiveContact } from "@/modules/contacts/actions";
import type { ContactRow } from "@/modules/contacts/actions";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusDot({ isActive }: { isActive: boolean }) {
  if (!isActive) return <span className="h-2 w-2 rounded-full bg-muted-foreground/30 inline-block" />;
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
    </span>
  );
}

function LastActiveBadge({ date }: { date: Date | null }) {
  if (!date) return null;

  const d = new Date(date);
  const now = new Date();
  const diffHours = (now.getTime() - d.getTime()) / 1000 / 3600;
  const isLive = diffHours < 24;

  const label = isLive
    ? "SQL-LIVE"
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <span
      className={`
        inline-flex items-center gap-1 text-[10px] font-semibold tracking-tight
        ${isLive ? "text-primary" : "text-muted-foreground"}
      `}
    >
      {isLive && <Zap className="h-3 w-3" />}
      {label}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactsDataTableProps {
  data: ContactRow[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  search: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  role: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactsDataTable({
  data,
  totalItems,
  totalPages,
  currentPage,
  search,
  sortBy,
  sortDir,
  role,
}: ContactsDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Build updated URL with merged params
  const buildUrl = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val === undefined || val === "") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const navigate = (updates: Record<string, string | number | undefined>) => {
    startTransition(() => router.push(buildUrl(updates)));
  };

  const handleSort = (key: string, dir: "asc" | "desc") => {
    navigate({ sort: key, dir, page: 1 });
  };

  const handleSearch = (value: string) => {
    navigate({ search: value || undefined, page: 1 });
  };

  const handleRole = (value: string) => {
    navigate({ role: value === "all" ? undefined : value, page: 1 });
  };

  // Double-click row → Navigate to Detail View (MASTER: REGISTRY)
  const handleRowDoubleClick = (id: string) => {
    router.push(`/contacts/${id}`);
  };

  const hasFilters = search || role !== "all";

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            id="contacts-search"
            defaultValue={search}
            placeholder="Search registry..."
            className="pl-9 bg-muted/20"
            onChange={(e) => {
              const val = e.target.value;
              const timer = setTimeout(() => handleSearch(val), 350);
              return () => clearTimeout(timer);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="contacts-role-filter"
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  {role === "company" ? "Companies" : role === "individual" ? "Individuals" : "All Types"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Entity Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={role} onValueChange={handleRole}>
                <DropdownMenuRadioItem value="all" className="text-sm cursor-pointer">All Types</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="company" className="text-sm cursor-pointer">Companies</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="individual" className="text-sm cursor-pointer">Individuals</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters */}
          {hasFilters && (
            <Button
              id="contacts-clear-filters"
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground gap-2"
              onClick={() => navigate({ search: undefined, role: undefined, page: 1 })}
            >
              <X className="h-4 w-4" /> Clear
            </Button>
          )}

          {/* Result count */}
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalItems} entities
          </span>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] px-4" />
              <TableHead className="px-4">
                <DataTableColumnHeader
                  label="Entity Name"
                  sortKey="name"
                  currentSort={sortBy}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4 hidden md:table-cell text-xs font-semibold text-muted-foreground">
                Contact Point
              </TableHead>
              <TableHead className="px-4 hidden lg:table-cell text-xs font-semibold text-muted-foreground">
                Parent Structure
              </TableHead>
              <TableHead className="px-4">
                <DataTableColumnHeader
                  label="Status"
                  sortKey="is_company"
                  currentSort={sortBy}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4 hidden xl:table-cell">
                <DataTableColumnHeader
                  label="Last Active"
                  sortKey="last_active"
                  currentSort={sortBy}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4 text-right" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-muted-foreground font-medium"
                >
                  No entities found
                </TableCell>
              </TableRow>
            ) : (
              data.map((contact) => (
                <TableRow
                  key={contact.id}
                  onDoubleClick={() => handleRowDoubleClick(contact.id)}
                  className="cursor-pointer group transition-colors hover:bg-muted/50"
                >
                  {/* Type icon */}
                  <TableCell className="px-4 py-3">
                    <div className="flex size-8 items-center justify-center rounded-md border bg-muted/30">
                      {contact.is_company ? (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       <Link
                        href={`/contacts/${contact.id}`}
                        className="text-sm font-semibold hover:underline decoration-primary/30 text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {contact.name}
                      </Link>
                      {contact.is_company && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold h-5 uppercase tracking-tighter">
                          B2B
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Contact info */}
                  <TableCell className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      {contact.email && (
                        <span className="text-xs text-foreground/80 font-medium">
                          {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="text-[11px] text-muted-foreground">
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Parent */}
                  <TableCell className="px-4 py-3 hidden lg:table-cell">
                    {contact.parent_name && (
                      <span className="text-xs text-muted-foreground/80 italic">
                        ↳ {contact.parent_name}
                      </span>
                    )}
                  </TableCell>

                  {/* Status dot */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <StatusDot isActive={contact.is_active} />
                      <span className="text-xs font-medium">
                        {contact.is_active ? "Active" : "Archived"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Last active */}
                  <TableCell className="px-4 py-3 hidden xl:table-cell">
                    <LastActiveBadge date={contact.last_active} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        id={`edit-${contact.id}`}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        asChild
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        title="Edit entity"
                      >
                        <Link href={`/contacts/${contact.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form
                        action={archiveContact}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="hidden" name="id" value={contact.id} />
                        <Button
                          id={`archive-${contact.id}`}
                          size="icon"
                          variant="ghost"
                          type="submit"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          title="Archive entity"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground tabular-nums font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              id="contacts-prev-page"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => navigate({ page: currentPage - 1 })}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              id="contacts-next-page"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => navigate({ page: currentPage + 1 })}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
