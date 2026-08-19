export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Mini QR Ordering System
      </h1>
      <p className="text-sm text-muted-foreground">
        Scan a table QR code to start ordering.
      </p>
    </main>
  );
}
