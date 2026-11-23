import { collectionHandlers } from '@/app/api/_lib/crud';
import { educationResource } from '@/app/api/_lib/resources';

export const { GET, POST } = collectionHandlers(educationResource);
