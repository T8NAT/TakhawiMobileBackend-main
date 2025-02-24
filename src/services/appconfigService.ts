import prisma from '../../prisma/client';
import { CreateAppConfig, AppConfig } from '../types/appConfigTypr';
import { removeFile } from '../utils/fileHandler';

class AppConfigService {
  async create(data: CreateAppConfig): Promise<AppConfig> {
    return prisma.app_Config.create({ data });
  }

  async getAll(type: string): Promise<AppConfig[]> {
    return prisma.app_Config.findMany({ where: { type } });
  }

  async delete(id: number): Promise<void> {
    const appConfig = await prisma.app_Config.findUnique({ where: { id } });
    if (!appConfig) {
      throw new Error('App Config not found');
    }
    if (appConfig.type === 'IMAGE') {
      removeFile(appConfig.value);
    }
    await prisma.app_Config.delete({ where: { id } });
  }
}

const appConfigService = new AppConfigService();
export default appConfigService;
