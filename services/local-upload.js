const jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

class UploadAvatarService {
  constructor(folderAvatars) {
    this.folderAvatars = folderAvatars;
  }

  async transformAvatar(pathfile) {
    const pic = await jimp.read(pathfile);
    pic
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathfile);
  }

  async saveAvatar({ idUser, file }) {
    await this.transformAvatar(file.path);
    await fs.rename(
      file.path,
      path.join(process.env.AVATAR_OF_USERS, file.filename)
    );
    return path.normalize(path.join("/avatars", file.filename));
  }
}

module.exports = UploadAvatarService;
