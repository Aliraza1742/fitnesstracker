const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/services/notification.ts',
  'src/screens/workouts/Workouts.tsx',
  'src/screens/settings/useSettings.ts',
  'src/screens/settings/Settings.tsx',
  'src/screens/profile/useProfile.ts',
  'src/screens/nutrition/NutritionScreen.tsx',
  'src/screens/dashboard/useDashboard.ts',
  'src/screens/auth/register/Register.tsx',
  'src/screens/auth/login/Login.tsx',
  'src/components/workouts/WorkoutFormModal.tsx',
  'src/components/common/WorkoutDebugTest.tsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace Alert.alert with customAlert
  if (content.includes('Alert.alert')) {
    content = content.replace(/Alert\.alert/g, 'customAlert');
    
    // Determine relative path to src/utils/alert.ts
    const depth = file.split('/').length - 2;
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    const importStatement = `import { customAlert } from '${prefix}utils/alert';\n`;
    
    // Add import statement after the last import
    const importRegex = /import [^;]+;/g;
    let match;
    let lastImportIndex = -1;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    if (lastImportIndex !== -1) {
      content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
    } else {
      content = importStatement + content;
    }
    
    // Remove unused Alert import from react-native if it exists
    content = content.replace(/import\s+{([^}]*)\bAlert\b([^}]*)}\s+from\s+['"]react-native['"];/g, (match, p1, p2) => {
      const remaining = `${p1}${p2}`.replace(/,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '').trim();
      if (remaining) {
        return `import { ${remaining} } from 'react-native';`;
      }
      return '';
    });
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
