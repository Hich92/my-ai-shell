import { notFound } from "next/navigation";
import { 
  getContactWithNotes, 
} from "@/modules/contacts/actions";
import { getAdjacentContactIds } from "@/modules/core/actions";
import { ContactDetailsView } from "./_components/contact-details-view";
import { Chatter } from "./_components/Chatter";
import { BreadcrumbUpdater } from "@/components/layout/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Note {
  id: string;
  targetId: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface ContactResult {
  id: string;
  name: string;
  isCompany: boolean;
  email: string | null;
  phone: string | null;
  parentId: string | null;
  createdAt: Date;
  isActive: boolean;
  notes: Note[];
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: contactId } = await params;

  if (!contactId) notFound();

  // Unified Parallel Fetch: Contacts (sys_org) AND Notes (core) via Prisma 7
  const [contactResult, adjacent] = await Promise.all([
    getContactWithNotes(contactId) as Promise<ContactResult | null>,
    getAdjacentContactIds(contactId),
  ]);

  if (!contactResult) notFound();

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700">
      <BreadcrumbUpdater segment={contactId} label={contactResult.name} />
      
      {/* MASTER: DETAIL HEADER */}
      <div className="h-20 border-b flex items-center justify-between px-8 md:px-12 sticky top-0 bg-background/80 backdrop-blur z-30">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/contacts">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              {contactResult.name}
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-40 mt-1">
              sys_org.entity_view · Consultation Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-full p-1 mr-4 bg-muted/20">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full" disabled={!adjacent.prevId}>
              <Link href={adjacent.prevId ? `/contacts/${adjacent.prevId}` : "#"}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full" disabled={!adjacent.nextId}>
              <Link href={adjacent.nextId ? `/contacts/${adjacent.nextId}` : "#"}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Button variant="outline" size="sm" asChild className="gap-2 font-bold px-6">
            <Link href={`/contacts/${contactId}/edit`}>
              <Edit className="h-3.5 w-3.5" />
              Edit Entity
            </Link>
          </Button>
        </div>
      </div>

      {/* MASTER: DETAIL CONTENT (70/30 Relational Grid) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-muted/30">
        
        {/* LEFT COLUMN (70%): Core Data */}
        <main className="flex-[0.7] border-r bg-background overflow-y-auto p-8 md:p-16">
          <div className="max-w-3xl mx-auto">
            <ContactDetailsView 
                contact={{
                    id: contactResult.id,
                    name: contactResult.name,
                    is_company: contactResult.isCompany,
                    email: contactResult.email,
                    phone: contactResult.phone,
                    parent_id: contactResult.parentId,
                    created_at: contactResult.createdAt,
                    is_active: contactResult.isActive
                }} 
                contactId={contactId} 
            />
          </div>
        </main>

        {/* RIGHT COLUMN (30%): Relational Chatter (core schema) */}
        <aside className="flex-[0.3] bg-muted/10 overflow-y-auto p-8 border-l border-dashed h-full">
            <Chatter entityId={contactId} notes={contactResult.notes} />
        </aside>
      </div>
    </div>
  );
}
