import prisma from '../client';
import hobbies from '../data/hobbies.json';

const hobbiesSeeding = async () => {
  try {
    const existingHobbies = await prisma.hobbies.findMany();

    if (existingHobbies.length === 0) {
      await prisma.hobbies.createMany({ data: hobbies });
    }
  } catch (error) {
    console.error('Error on hobbies seeding:', error);
  }
};

export default hobbiesSeeding;
