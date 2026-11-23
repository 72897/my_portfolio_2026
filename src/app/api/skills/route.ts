import { collectionHandlers } from '@/app/api/_lib/crud';
import { skillResource } from '@/app/api/_lib/resources';

export const { GET, POST } = collectionHandlers(skillResource);
