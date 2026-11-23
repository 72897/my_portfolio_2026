import { itemHandlers } from '@/app/api/_lib/crud';
import { projectResource } from '@/app/api/_lib/resources';

export const { GET, PUT, DELETE } = itemHandlers(projectResource);
