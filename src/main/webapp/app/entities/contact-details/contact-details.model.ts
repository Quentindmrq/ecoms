import { IAddress } from 'app/entities/address/address.model';

export interface IContactDetails {
  id?: number;
  phoneNumber?: string | null;
  address?: IAddress | null;
}

export class ContactDetails implements IContactDetails {
  constructor(public id?: number, public phoneNumber?: string | null, public address?: IAddress | null) {}
}

export function getContactDetailsIdentifier(contactDetails: IContactDetails): number | undefined {
  return contactDetails.id;
}
