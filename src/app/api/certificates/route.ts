import { collectionHandlers } from '@/app/api/_lib/crud';
import { certificateResource } from '@/app/api/_lib/resources';

export const { GET, POST } = collectionHandlers(certificateResource);
