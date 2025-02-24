export type UploadDocuments = {
  type: string;
  file_path: string;
  userId: number;
  is_exist?: boolean;
};

export type CheckImageUploadStatus = {
  Vehicle_Images: boolean;
  Vehicle_Licence: boolean;
  Insurance_Image: boolean;
  National_Id_Images: boolean;
  Driving_Licence_Images: boolean;
  Avatar_Image: boolean;
  Vehicle_Exist: boolean;
};
