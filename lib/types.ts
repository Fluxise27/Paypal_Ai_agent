export type AuditStep = {
  at: string;
  label: string;
  detail?: string;
};

export type CheckoutResult = {
  mode: "agent" | "safe";
  orderId: string;
  approveUrl: string;
  item: {
    name: string;
    price: number;
  };
  rationale: string;
  steps: AuditStep[];
};
