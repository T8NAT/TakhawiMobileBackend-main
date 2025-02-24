// import { prismaMock } from '../prismaMock';
// import cityService from '../../src/services/cityService';
// import { CreateCity, City, UpdateCity } from '../../src/types/cityType';

// describe('City Service', () => {
//   // Test data
//   const cityToCreate: CreateCity = { ar_name: 'القاهرة', en_name: 'Cairo' };
//   const cityToUpdate: UpdateCity = { ar_name: 'الجيزة', en_name: 'Giza' };
//   const expectedCity: City = {
//     id: expect.any(Number),
//     createdAt: expect.any(Date),
//     updatedAt: expect.any(Date),
//     deletedAt: null,
//     ...cityToCreate,
//   };
//   const mockedCity: City = {
//     id: 1,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     deletedAt: null,
//     ar_name: 'القاهرة',
//     en_name: 'Cairo',
//   };

//   describe('Create', () => {
//     it('should create a city', async () => {
//       // Mock Prisma create method
//       prismaMock.city.create.mockResolvedValue(mockedCity);

//       // Call the service method
//       const result = await cityService.create(cityToCreate);

//       // Assertions
//       expect(result).toEqual(expectedCity);
//       expect(prismaMock.city.create).toHaveBeenCalledWith({
//         data: cityToCreate,
//       });
//     });
//   });

//   describe('Retrieve', () => {
//     it('should get all cities', async () => {
//       // Mock Prisma findMany method
//       prismaMock.city.findMany.mockResolvedValue([mockedCity]);

//       // Call the service method
//       const result = await cityService.getAll({});

//       // Assertions
//       expect(result).toEqual([expectedCity]);
//       expect(prismaMock.city.findMany).toHaveBeenCalled();
//     });
//     it('should get a city by id', async () => {
//       // Mock Prisma findUnique method
//       prismaMock.city.findUnique.mockResolvedValue(mockedCity);

//       // Call the service method
//       const result = await cityService.getOne(1);

//       // Assertions
//       expect(result).toEqual(expectedCity);
//       expect(prismaMock.city.findUnique).toHaveBeenCalledWith({
//         where: { id: 1 },
//       });
//     });
//   });

//   describe('Update', () => {
//     it('should update a city', async () => {
//       // Mock Prisma methods
//       prismaMock.city.update.mockResolvedValue({
//         ...mockedCity,
//         ...cityToUpdate,
//       });
//       prismaMock.city.findUnique.mockResolvedValue(mockedCity);

//       // Call the service method
//       const result = await cityService.update(1, cityToUpdate);

//       // Assertions
//       expect(result).toEqual({ ...expectedCity, ...cityToUpdate });
//       expect(prismaMock.city.update).toHaveBeenCalledWith({
//         where: { id: 1 },
//         data: cityToUpdate,
//       });
//     });
//   });

//   describe('Delete', () => {
//     it('should delete a city', async () => {
//       // Mock Prisma methods
//       prismaMock.city.update.mockResolvedValue({
//         ...mockedCity,
//         deletedAt: new Date(),
//       });
//       prismaMock.city.findUnique.mockResolvedValue(mockedCity);

//       // Call the service method
//       await cityService.delete(1);

//       // Assertions
//       expect(prismaMock.city.update).toHaveBeenCalledWith({
//         where: { id: 1 },
//         data: { deletedAt: expect.any(Date) },
//       });
//     });
//   });
// });
