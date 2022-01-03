const BusBoy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const os = require("os");
const admin = require("firebase-admin");
const { handleError } = require("../../utils/handleError");
const { mapQuestionToUser } = require("../questions/service");
const { createUser, updateImage } = require("./service");
const firebaseConfig = require("../../utils/config");

exports.create = async (req, res) => {
  try {
    const {
      displayName,
      password,
      email,
      phoneNumber,
      role,
      questionId,
      answer,
    } = req.body;

    if (
      !displayName ||
      !password ||
      !email ||
      !role ||
      !questionId ||
      !answer
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { uid, ...user } = await admin.auth().createUser({
      displayName,
      password,
      email,
      phoneNumber,
    });

    await admin.auth().setCustomUserClaims(uid, { role });

    let userData = [];
    if (role === "admin") {
      userData = [
        uid,
        user.displayName,
        user.email,
        user.phoneNumber,
        role,
        user.metadata.creationTime,
      ];
    } else {
      userData = [
        uid,
        user.email,
        user.displayName,
        user.phoneNumber,
        user.photoURL,
        user.providerData[0].providerId,
        role,
        user.metadata.creationTime,
      ];
    }

    createUser(userData, role, async (err, results) => {
      if (err) {
        await admin.auth().deleteUser(uid);
        return handleError(res, err);
      }
      if (!results) {
        const error = {
          code: "Issue to fetch result",
          message: "Something went wrong",
        };
        return handleError(res, error);
      }
      const userQuestionData = [uid, questionId, answer];
      mapQuestionToUser(userQuestionData, role, async (err, results) => {
        if (err) {
          await admin.auth().deleteUser(uid);
          return handleError(res, err);
        }
        if (!results) {
          const error = {
            code: "Issue to fetch result",
            message: "Something went wrong",
          };
          return handleError(res, error);
        }
        return res.status(201).json({ uid });
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.all = async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).json({ users });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.get = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).json({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.patch = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await admin.auth().updateUser(id, { displayName, password, email });
    await admin.auth().setCustomUserClaims(id, { role });
    const user = await admin.auth().getUser(id);

    return res.status(204).json({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.auth().deleteUser(id);
    return res.status(204).json({});
  } catch (err) {
    return handleError(res, err);
  }
};

//! Upload a profile image for user/restaurant

exports.uploadImage = (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let generatedToken = uuidv4();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const fileType = ["image/jpeg", "image/jpg", "image/png"];
    if (!fileType.includes(mimetype)) {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    //! name.image.png
    const filenameArray = filename.split(".");
    const imageExtension = filenameArray[filenameArray.length - 1];

    //! 545615615.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;

    const filePath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        const data = [imageUrl, req.user.uid];
        updateImage(data, req.user.role, async (err, results) => {
          if (err) {
            return handleError(res, err);
          }
          if (!results) {
            const error = {
              code: "Issue to fetch result",
              message: "Something went wrong",
            };
            return handleError(res, error);
          }
          return res
            .status(201)
            .json({ message: "Image uploaded successfully", imageUrl });
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

const mapUser = (user) => {
  const customClaims = user.customClaims || { role: "" };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};
