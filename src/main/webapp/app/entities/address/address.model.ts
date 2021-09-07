import { Country } from 'app/entities/enumerations/country.model';

export interface IAddress {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  country?: Country | null;
  postalCode?: string | null;
  city?: string | null;
  address1?: string | null;
  address2?: string | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public country?: Country | null,
    public postalCode?: string | null,
    public city?: string | null,
    public address1?: string | null,
    public address2?: string | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
