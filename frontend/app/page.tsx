"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { QR_CODE_OPTIONS } from "@/constants/config";

export default function Home() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  async function handleGenerate() {
    const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}${APP_ROUTES.order}`;
    const dataUrl = await QRCode.toDataURL(orderUrl, QR_CODE_OPTIONS);
    setQrDataUrl(dataUrl);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Mini QR Ordering System
      </h1>
      <p className="text-sm text-muted-foreground">
        Scan a table QR code to start ordering.
      </p>
      <Button onClick={handleGenerate}>Generate QR Code</Button>
      {qrDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt="Order page QR code"
          width={256}
          height={256}
          className="rounded-md border border-border"
        />
      )}
    </main>
  );
}
