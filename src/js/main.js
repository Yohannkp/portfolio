import { initNavigation } from './modules/navigation.js';
import { initContentEnhancements } from './modules/contentEnhancements.js';

export const bootstrap = () => {
  initNavigation();
  initContentEnhancements();
};

bootstrap();
