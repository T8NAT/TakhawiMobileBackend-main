import citySeeding from './citySeeding';
import hobbiesSeeding from './hobbiesSeeding';
import reasonsSeeding from './reasonsSeeding';

const seeding = async () => {
  await citySeeding();
  await hobbiesSeeding();
  await reasonsSeeding();
};

export default seeding;
