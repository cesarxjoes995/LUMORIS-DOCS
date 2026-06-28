const sharp = require('sharp');
const fs = require('fs');

async function resize() {
  const inputBuffer = fs.readFileSync('public/logo.png');
  const outputBuffer = await sharp(inputBuffer)
    .resize({ width: 256 })
    .png({ quality: 80 })
    .toBuffer();
  fs.writeFileSync('public/logo-email.png', outputBuffer);
  console.log('Successfully resized logo');
}
resize().catch(console.error);
