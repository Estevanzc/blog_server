const fs = require('fs/promises');
const path = require('path');

module.exports = {
    async imageUpload({ model, file, field = 'photo' }) {
        if (!model || !file) return;

        const oldPath = model[field];

        if (oldPath) {
            const absolutePath = path.resolve(
                process.cwd(),
                oldPath.startsWith('/') ? oldPath.slice(1) : oldPath
            );

            try {
                await fs.unlink(absolutePath);
            } catch (err) {
            }
        }

        await model.update({
            [field]: `/uploads/${file.filename}`
        });
    },
};
