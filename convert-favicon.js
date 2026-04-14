const path = require('path');
const { Jimp } = require('jimp');

(async () => {
  try {
    const icoPath = path.join('public', 'favicon.ico');
    const favicon = await Jimp.read(icoPath);
    console.log('✓ Favicon loaded:', favicon.width, 'x', favicon.height);

    const base = path.join('android', 'app', 'src', 'main', 'res');
    const sizes = [
      { folder: 'mipmap-mdpi',    size: 48  },
      { folder: 'mipmap-hdpi',    size: 72  },
      { folder: 'mipmap-xhdpi',   size: 96  },
      { folder: 'mipmap-xxhdpi',  size: 144 },
      { folder: 'mipmap-xxxhdpi', size: 192 },
    ];

    for (const { folder, size } of sizes) {
      const outDir = path.join(base, folder);
      const targets = ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'];
      
      for (const name of targets) {
        const outPath = path.join(outDir, name);
        const resized = favicon.clone().resize({ width: size, height: size });
        
        // For launcher, add white background
        if (name === 'ic_launcher.png') {
          const bg = new Jimp({ width: size, height: size, color: 0xffffffff });
          bg.composite(resized, 0, 0);
          await bg.write(outPath);
        } else {
          await resized.write(outPath);
        }
      }
      console.log('✓ ' + folder);
    }
    console.log('✓ Done!');
  } catch (e) {
    console.error('✗ Error:', e.message);
    process.exit(1);
  }
})();

