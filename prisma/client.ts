import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
});

// To know performance of each query
// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query);
//   console.log('Params: ' + e.params);
//   console.log('Duration: ' + e.duration + 'ms');
// });

export default prisma;
