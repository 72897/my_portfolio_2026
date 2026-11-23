import { collectionHandlers } from '@/app/api/_lib/crud';
import { experienceResource } from '@/app/api/_lib/resources';

export const { GET, POST } = collectionHandlers(experienceResource);
