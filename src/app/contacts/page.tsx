import { getContactsWithSort } from "@/modules/contacts/actions";
import { ContactsDataTable } from "@/components/framework/contacts-data-table";

export const dynamic = "force-dynamic";

export default async function ContactsRegistryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    dir?: string;
    role?: string;
  }>;
}) {
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search ?? "";
  const sortBy = sp.sort ?? "name";
  const sortDir: "asc" | "desc" = sp.dir === "desc" ? "desc" : "asc";
  const role = sp.role ?? "all";
  
  // Master: Registry Template (Full-width DataTable)
  const { data, totalItems, totalPages, currentPage } =
    await getContactsWithSort({ page, search, sortBy, sortDir, role });

  return (
    <div className="flex-1 flex flex-col p-8 md:p-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 px-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
          Global Registry
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">
          sys_org.m_entities · Management Console
        </p>
      </div>

      <div className="flex-1 bg-card/10 rounded-xl overflow-hidden">
        <ContactsDataTable
          data={data}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          search={search}
          sortBy={sortBy}
          sortDir={sortDir}
          role={role}
        />
      </div>
    </div>
  );
}
