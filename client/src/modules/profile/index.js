import { useContext, Fragment, useState } from "react";

//! Ant Imports

import { Button, Tooltip } from "antd";

//! User Files

import * as ActionTypes from "common/actionTypes";
import { AppContext } from "AppContext";
import { toast } from "common/utils";
import api from "common/api";
import { auth } from "_firebase";
import logo from "../../assets/images/placeholder.jpg";

function Profile() {
  const {
    state: { currentUser, userImage },
    dispatch,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const displayName = currentUser?.displayName;

  const onChange = (e) => {
    // TODO: If size is greater than 3 MB, throw Error
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    setLoading(true);
    api
      .post("/users/image", formData)
      .then((res) => {
        const { imageUrl } = res.data;
        const updatedUser = {
          ...currentUser,
          imageUrl,
        };
        dispatch({ type: ActionTypes.SET_CURRENT_USER, data: updatedUser });
        dispatch({ type: ActionTypes.SET_USER_IMAGE, data: imageUrl });
        const user = auth.currentUser;
        user
          .updateProfile({
            photoURL: imageUrl,
          })
          .then(() => {
            toast({
              message: "Image uploaded successfully",
              type: "success",
            });
          })
          .catch(() => {
            toast({
              message: "Image upload failed.",
              type: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        toast({
          message: "Image upload failed.",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpload = (e) => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  return (
    <div className="profile">
      <Fragment>
        <img
          width={200}
          height={200}
          alt={displayName}
          src={userImage !== "null" ? userImage : logo}
        />
        <input type="file" id="imageInput" hidden onChange={onChange} />
        <Tooltip placement="top" title="Change Profile Picture">
          <Button type="primary" loading={loading} onClick={handleUpload}>
            {loading ? "Uploading" : "Upload Picture"}
          </Button>
        </Tooltip>
      </Fragment>
    </div>
  );
}

export default Profile;
