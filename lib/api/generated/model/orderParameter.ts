

export type OrderParameter = typeof OrderParameter[keyof typeof OrderParameter];

export const OrderParameter = {
  asc: 'asc',
  desc: 'desc',
} as const;
