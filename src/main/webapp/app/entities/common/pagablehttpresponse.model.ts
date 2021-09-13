export interface PagableResponse<T> {
  content: T[];
  first?: boolean;
  last?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  postalCode?: string | null;
  city?: string | null;
  address1?: string | null;
  address2?: string | null;
}
