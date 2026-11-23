import { itemHandlers } from '@/app/api/_lib/crud';
import { educationResource } from '@/app/api/_lib/resources';

export const { GET, PUT, DELETE } = itemHandlers(educationResource);
