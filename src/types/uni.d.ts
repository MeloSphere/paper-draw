declare const uni: {
  navigateTo(options: { url: string }): void;
  showToast(options: { title: string; icon?: 'success' | 'loading' | 'none' }): void;
  request(options: {
    url: string;
    method?: string;
    data?: any;
    header?: any;
    success?: (res: any) => void;
    fail?: (err: any) => void;
  }): void;
  uploadFile(options: {
    url: string;
    filePath: string;
    name: string;
    success?: (res: any) => void;
    fail?: (err: any) => void;
  }): void;
  chooseImage(options: {
    count: number;
    success?: (res: { tempFilePaths: string[] }) => void;
    fail?: (err: any) => void;
  }): void;
  previewImage(options: {
    urls: string[];
    current?: string;
  }): void;
}; 