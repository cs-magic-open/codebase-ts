import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const WechatMessageSumOrderByAggregateInputSchema: z.ZodType<Prisma.WechatMessageSumOrderByAggregateInput> = z.object({
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export default WechatMessageSumOrderByAggregateInputSchema;
