import { CreateAppConfig, AppConfig } from '../types/appConfigTypr';
declare class AppConfigService {
    create(data: CreateAppConfig): Promise<AppConfig>;
    getAll(type: string): Promise<AppConfig[]>;
    delete(id: number): Promise<void>;
}
declare const appConfigService: AppConfigService;
export default appConfigService;
