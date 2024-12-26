declare module 'uview-plus' {
  import { App } from 'vue';
  
  const uviewPlus: {
    install: (app: App) => void;
  };
  
  export default uviewPlus;
} 