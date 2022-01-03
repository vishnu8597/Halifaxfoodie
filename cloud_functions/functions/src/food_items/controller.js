const BusBoy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const os = require("os");
const admin = require("firebase-admin");
const moment = require("moment");
const { handleError } = require("../../utils/handleError");
const {
  createFoodItem,
  getAllFoodItems,
  getFoodItemById,
  getFoodItemsByRestaurantId,
  deleteFoodItem,
  updateFoodItemById,
  getFeaturedFoodItemsByRestaurantId,
  updateFoodItemImage,
} = require("./service");
const firebaseConfig = require("../../utils/config");

exports.create = async (req, res) => {
  try {
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const restaurantId = req.user.uid;
    const { itemName, price, recipe, featured, ingredients, preparationTime } =
      req.body;
    const foodItemData = [
      itemName,
      price,
      recipe,
      featured,
      ingredients,
      preparationTime,
      currentTime,
      currentTime,
      restaurantId,
    ];
    createFoodItem(foodItemData, async (err, results) => {
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
      const lastInsertedId = results.insertId;
      return res.status(201).json({
        success: true,
        message: "Food Item created successfully",
        itemId: lastInsertedId,
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.allFoodItems = async (req, res) => {
  try {
    getAllFoodItems((err, results) => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getFoodItemById = async (req, res) => {
  try {
    const { item_id } = req.params;
    const data = [item_id];
    getFoodItemById(data, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getFoodItemsByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const data = [restaurant_id];
    getFoodItemsByRestaurantId(data, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getFeaturedFoodItemsByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const data = [restaurant_id];
    getFeaturedFoodItemsByRestaurantId(data, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const { item_id } = req.params;
    const { itemName, price, recipe, featured, ingredients, preparationTime } =
      req.body;
    const updatedFoodItemData = [
      itemName,
      price,
      recipe,
      featured,
      ingredients,
      preparationTime,
      currentTime,
      item_id,
    ];
    updateFoodItemById(updatedFoodItemData, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      if (results.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Updated successfully",
        });
      }
      return res.status(401).json({
        success: true,
        message: "Please check the food item id",
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.removeFoodItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const data = [item_id];
    deleteFoodItem(data, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      if (results.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: "Deleted successfully",
        });
      }
      return res.status(401).json({
        success: true,
        message: "Please check the food item id",
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

//! Upload a profile image for user/restaurant

exports.uploadFoodItemImage = (req, res, foodItemId) => {
  const { item_id } = req.params;
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
        const data = [imageUrl, item_id];
        updateFoodItemImage(data, async (err, results) => {
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
          if (results.affectedRows > 0) {
            return res.status(200).json({
              success: true,
              message: "Food item created successfully",
            });
          }
          return res.status(401).json({
            success: true,
            message: "Please check the food item id",
          });
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
