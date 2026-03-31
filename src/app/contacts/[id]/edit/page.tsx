import { notFound } from "next/navigation";
import { 
  getContactById, 
  getCompanies,
} from "@/modules/contacts/actions";
import { getAdjacentContactIds } from "@/modules/core/actions";
import { ContactEditForm } from "./_components/contact-edit-form";
import { BreadcrumbUpdater } from "@/components/layout/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Save, X, ChevronLeft, ChevronRight, History } from "lucide-react";
import Link from "next/link";

export default async function ContactEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: contactId } = await params;

  if (!contactId) notFound();

  const [contact, companies, adjacent] = await Promise.all([
    getContactById(contactId),
    getCompanies(),
    getAdjacentContactIds(contactId),
  ]);

  if (!contact) notFound();

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700">
      <BreadcrumbUpdater segment={contactId} label={contact.name} />
      
      {/* MASTER: EDITOR HEADER */}
      <div className="h-20 border-b flex items-center justify-between px-8 md:px-12 sticky top-0 bg-background/80 backdrop-blur z-30">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={`/contacts/${contactId}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Editing: {contact.name}
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mt-1">
              sys_org.entity_edit · Writing Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="ghost" size="sm" asChild className="gap-2 font-bold px-6 text-muted-foreground hover:text-foreground">
            <Link href={`/contacts/${contactId}`}>
              <X className="h-3.5 w-3.5" />
              Cancel
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="gap-2 font-bold px-6 text-primary border-primary/20 hover:bg-primary/5 shadow-none">
             <Save className="h-3.5 w-3.5" />
             Save
          </Button>

          <Button variant="default" size="sm" className="gap-2 font-bold px-6 shadow-none">
             <Save className="h-3.5 w-3.5" />
             Save & Close
          </Button>
        </div>
      </div>

      {/* MASTER: EDITOR CONTENT (70/30 Layout) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-muted/30">
        
        {/* LEFT COLUMN (70%): Form Inputs */}
        <main className="flex-[0.7] border-r bg-background overflow-y-auto p-8 md:p-16">
          <div className="max-w-3xl mx-auto">
            <ContactEditForm contact={contact} companies={companies} />
          </div>
        </main>

        {/* RIGHT COLUMN (30%): Activity / Context Info */}
        <aside className="flex-[0.3] bg-muted/10 overflow-y-auto p-8 border-l border-dashed">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-2">
                <History className="h-3 w-3" />
                Context State
              </h3>
            </div>
            
            <div className="p-6 border border-dashed border-primary/20 bg-primary/5 rounded-xl space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-tight text-primary">
                 Modification Warning
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                 You are currently in **Writing Mode**. Any changes made to this entity will be logged and attributed to your current session.
              </p>
              <div className="pt-2 flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Live session active</span>
              </div>
            </div>

             {/* Quick Navigation in Sidebar */}
             <div className="pt-8 border-t border-dashed border-muted-foreground/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Adjacent Records</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="ghost" size="sm" asChild className="h-8 text-[9px] font-bold tracking-widest uppercase border border-dashed border-muted-foreground/10" disabled={!adjacent.prevId}>
                      <Link href={adjacent.prevId ? `/contacts/${adjacent.prevId}/edit` : "#"}>
                         <ChevronLeft className="h-3 w-3 mr-1" /> Prev
                      </Link>
                   </Button>
                   <Button variant="ghost" size="sm" asChild className="h-8 text-[9px] font-bold tracking-widest uppercase border border-dashed border-muted-foreground/10" disabled={!adjacent.nextId}>
                      <Link href={adjacent.nextId ? `/contacts/${adjacent.nextId}/edit` : "#"}>
                         Next <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                   </Button>
                </div>
             </div>

             <div className="pt-8 border-t border-dashed border-muted-foreground/10 hidden lg:block text-center">
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                   <span>UUID: {contactId}</span>
                   <span>AD: Session_v4</span>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}