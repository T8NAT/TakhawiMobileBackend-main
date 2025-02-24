import prisma from '../client';
import cities from '../data/cities.json';

const citySeeding = async () => {
  try {
    const cityExist = await prisma.city.findMany();
    if (cityExist.length === 0) {
      await prisma.city.createMany({
        data: cities.map((city) => city),
      });
    }
  } catch (error) {
    console.log('Error on city seeding');
  }
};

export default citySeeding;
