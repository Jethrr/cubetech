export function TopLoader() {
  return (
    <div
      role="progressbar"
      aria-label="Placing order"
      className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-primary/20"
    >
      <div className="h-full w-1/3 animate-[toploader-indeterminate_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
    </div>
  );
}
