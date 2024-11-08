import * as path from 'path';

export default () => ({
  upload: {
    // Store files in project_root/uploads
    dir: path.join(process.cwd(), 'uploads')
  }
}); 