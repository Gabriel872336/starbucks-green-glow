import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout/exito")({
  head: () => ({
    meta: [
      { title: "Compra exitosa — Starbucks Perú" },
      { name: "description", content: "Tu pedido fue confirmado. Gracias por tu compra." },
      { property: "og:title", content: "Compra exitosa — Starbucks Perú" },
      { property: "og:description", content: "Tu pedido fue confirmado. Gracias por tu compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { lastOrder } = useCart();
  const { user } = useAuth();

  const money = (value: number) => `S/ ${value.toFixed(2)}`;
  const paymentMethod = lastOrder?.method === "Tarjeta" ? "Tarjeta de Crédito/Débito" : lastOrder?.method;
  const taxableAmount = lastOrder ? lastOrder.total / 1.18 : 0;
  const taxAmount = lastOrder ? lastOrder.total - taxableAmount : 0;

  const downloadReceipt = async () => {
    if (!lastOrder) return;

    const { jsPDF } = await import("jspdf");
    const document = new jsPDF({ unit: "mm", format: "a4" });
    const left = 18;
    const right = 192;
    let y = 18;

    document.setDrawColor(0, 98, 65);
    document.setFillColor(0, 98, 65);
    document.rect(0, 0, 210, 31, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(17);
    document.text("STARBUCKS PERU S.A.C.", left, y);
    document.setFont("helvetica", "normal");
    document.setFontSize(9);
    document.text("RUC 20504839201", left, y + 6);

    y = 43;
    document.setTextColor(0, 98, 65);
    document.setFont("helvetica", "bold");
    document.setFontSize(14);
    document.text("BOLETA DE VENTA ELECTRONICA", left, y);
    document.setFontSize(11);
    document.text(lastOrder.receiptNumber, right, y, { align: "right" });

    y += 10;
    document.setTextColor(45, 45, 45);
    document.setFont("helvetica", "normal");
    document.setFontSize(9);
    document.text(`Fecha de emision: ${formatDate(lastOrder.issuedAt)}`, left, y);
    document.text(`Pedido: ${lastOrder.number}`, right, y, { align: "right" });
    y += 6;
    document.text(`Cliente: ${user?.name || "Cliente General / Publico"}`, left, y);
    y += 6;
    document.text("DNI: 47829103 (dato ficticio)", left, y);
    y += 6;
    document.text(`Metodo de pago: ${paymentMethod}`, left, y);

    y += 10;
    document.setFillColor(236, 243, 239);
    document.rect(left, y - 5, right - left, 8, "F");
    document.setFont("helvetica", "bold");
    document.text("Cant.", left + 2, y);
    document.text("Descripcion", left + 19, y);
    document.text("P. Unitario", 151, y, { align: "right" });
    document.text("Importe", right - 2, y, { align: "right" });
    y += 8;

    document.setFont("helvetica", "normal");
    for (const item of lastOrder.items) {
      const descriptionLines = document.splitTextToSize(item.title, 90) as string[];
      document.text(String(item.quantity), left + 3, y);
      document.text(descriptionLines, left + 19, y);
      document.text(money(item.price), 151, y, { align: "right" });
      document.text(money(item.price * item.quantity), right - 2, y, { align: "right" });
      y += Math.max(8, descriptionLines.length * 5);
      document.setDrawColor(220, 220, 220);
      document.line(left, y - 3, right, y - 3);
    }

    y += 4;
    const summaryLabelX = 145;
    document.text("Op. Gravada", summaryLabelX, y, { align: "right" });
    document.text(money(taxableAmount), right - 2, y, { align: "right" });
    y += 6;
    document.text("IGV (18%)", summaryLabelX, y, { align: "right" });
    document.text(money(taxAmount), right - 2, y, { align: "right" });
    y += 8;
    document.setFont("helvetica", "bold");
    document.setFontSize(11);
    document.setTextColor(0, 98, 65);
    document.text("TOTAL A PAGAR", summaryLabelX, y, { align: "right" });
    document.text(money(lastOrder.total), right - 2, y, { align: "right" });

    y += 17;
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(90, 90, 90);
    document.text("Representacion impresa de la Boleta de Venta Electronica", 105, y, { align: "center" });
    document.text("Documento demostrativo sin validez tributaria.", 105, y + 5, { align: "center" });
    document.save(`boleta-${lastOrder.receiptNumber}.pdf`);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="reveal-up mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-mint">
          <Check className="size-10" strokeWidth={3} />
        </div>
        <h1 className="mt-7 font-display text-4xl font-medium text-forest sm:text-5xl">¡Gracias por tu compra!</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Tu pago fue confirmado. Conserva esta boleta electrónica como constancia de tu pedido.
        </p>

        {lastOrder ? (
          <article className="mx-auto mt-8 overflow-hidden rounded-lg border border-border bg-card text-left shadow-lg print:shadow-none">
            <header className="flex flex-col gap-5 bg-primary px-5 py-6 text-primary-foreground sm:flex-row sm:items-start sm:justify-between sm:px-8">
              <div>
                <p className="font-display text-2xl font-semibold">STARBUCKS PERÚ S.A.C.</p>
                <p className="mt-1 text-sm text-primary-foreground/80">RUC 20504839201</p>
              </div>
              <div className="border-primary-foreground/30 sm:border-l sm:pl-6 sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.16em]">Boleta de Venta Electrónica</p>
                <p className="mt-2 font-mono text-lg font-bold">{lastOrder.receiptNumber}</p>
              </div>
            </header>

            <div className="grid gap-x-8 gap-y-3 border-b border-border px-5 py-5 text-sm sm:grid-cols-2 sm:px-8">
              <ReceiptField label="Fecha de emisión" value={formatDate(lastOrder.issuedAt)} />
              <ReceiptField label="N.º de pedido" value={lastOrder.number} />
              <ReceiptField label="Cliente" value={user?.name || "Cliente General / Público"} />
              <ReceiptField label="DNI" value="47829103 (dato ficticio)" />
              <ReceiptField label="Método de pago" value={paymentMethod || "No especificado"} />
            </div>

            <div className="overflow-x-auto px-5 py-5 sm:px-8">
              <table className="w-full min-w-[570px] border-collapse text-sm">
                <thead>
                  <tr className="border-y border-border bg-secondary/50 text-xs uppercase text-muted-foreground">
                    <th className="px-3 py-3 text-center">Cant.</th>
                    <th className="px-3 py-3 text-left">Descripción</th>
                    <th className="px-3 py-3 text-right">P. Unitario</th>
                    <th className="px-3 py-3 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOrder.items.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="px-3 py-4 text-center font-semibold">{item.quantity}</td>
                      <td className="px-3 py-4 font-medium">{item.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-right">{money(item.price)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-right font-semibold">{money(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-border bg-secondary/20 px-5 py-5 sm:px-8">
              <dl className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Op. Gravada</dt>
                  <dd>{money(taxableAmount)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>IGV (18%)</dt>
                  <dd>{money(taxAmount)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-forest">
                  <dt>Total a Pagar</dt>
                  <dd>{money(lastOrder.total)}</dd>
                </div>
              </dl>
            </div>

            <footer className="border-t border-dashed border-border px-5 py-4 text-center text-xs text-muted-foreground sm:px-8">
              Representación digital demostrativa · Documento sin validez tributaria
            </footer>
          </article>
        ) : (
          <div className="mx-auto mt-8 max-w-lg rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            <p>No encontramos un pedido reciente en esta sesión.</p>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/">Volver a la tienda</Link>
            </Button>
          </div>
        )}

        {lastOrder && (
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="outline" onClick={downloadReceipt}>
              <Download className="size-4" />
              Descargar Boleta (PDF)
            </Button>
            <Button size="lg" asChild>
              <Link to="/">
                <Store className="size-4" />
                Volver a la Tienda
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function ReceiptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
      <span className="font-semibold text-forest">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(value));
}
