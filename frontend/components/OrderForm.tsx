"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "@/constants/config";

interface OrderFormProps {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitting?: boolean;
  error?: string | null;
}

export function OrderForm({
  customerName,
  onCustomerNameChange,
  onSubmit,
  disabled = false,
  submitting = false,
  error = null,
}: OrderFormProps) {
  const [touched, setTouched] = useState(false);

  const nameInvalid =
    customerName.trim().length < MIN_NAME_LENGTH ||
    customerName.length > MAX_NAME_LENGTH;

  function handleSubmit() {
    setTouched(true);
    if (disabled || submitting || nameInvalid) return;
    onSubmit();
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="customer-name">Customer Name</Label>
        <Input
          id="customer-name"
          placeholder="Enter Name"
          value={customerName}
          maxLength={MAX_NAME_LENGTH}
          disabled={submitting}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={touched && nameInvalid}
        />
        {touched && nameInvalid && (
          <p className="text-xs text-destructive">
            Name must be {MIN_NAME_LENGTH}–{MAX_NAME_LENGTH} characters.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="lg"
        disabled={disabled || submitting}
        className="w-full rounded-full bg-gradient-to-r from-primary to-primary/70 text-base font-semibold shadow-md hover:from-primary/90 hover:to-primary/60"
        onClick={handleSubmit}
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}
