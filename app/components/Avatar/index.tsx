import { type User } from "@prisma/client";
import { default as AvatarMui } from "@mui/material/Avatar";
import { getUserImgSrc } from "~/utils/misc";
import { type SerializeFrom } from "@remix-run/node";

const Avatar = ({ user }: { user: SerializeFrom<User> }) => {
  return (
    <AvatarMui
      src={getUserImgSrc(user.avatarId)}
      sx={{ width: 32, height: 32 }}
    ></AvatarMui>
  );
};

export default Avatar;
