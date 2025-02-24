import reasons from '../data/reasons.json';
import prisma from '../client';

const reasonsSeeding = async () => {
  try {
    const existingReasons = await prisma.reason.findMany();

    if (existingReasons.length === 0) {
      await prisma.reason.createMany({ data: reasons });
    }
  } catch (error) {
    console.error('Error on reasons seeding:', error);
  }
};

export default reasonsSeeding;
