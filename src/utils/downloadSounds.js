const axios = require('axios');
const fs = require('fs');
const path = require('path');

const sounds = [
    { url: 'https://assets.mixkit.co/sfx/preview/mixkit-success-chime-1996.mp3', name: 'success.mp3' },
    { url: 'https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-alert-notification-2357.mp3', name: 'cart_add.mp3' },
    { url: 'https://assets.mixkit.co/sfx/preview/mixkit-delete-standard-621.mp3', name: 'delete.mp3' }
];

const targetDir = path.join(__dirname, '../assets/sounds');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

async function download() {
    for (const sound of sounds) {
        console.log(`Downloading ${sound.name}...`);
        try {
            const response = await axios({
                method: 'GET',
                url: sound.url,
                responseType: 'stream'
            });
            const writer = fs.createWriteStream(path.join(targetDir, sound.name));
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            console.log(`Finished ${sound.name}`);
        } catch (error) {
            console.error(`Failed to download ${sound.name}: ${error.message}`);
        }
    }
}

download();
