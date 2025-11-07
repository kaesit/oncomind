import React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import AccountCircle from "@mui/icons-material/AccountCircle";

const CustomAvatar = styled(Avatar)(() => ({
  width: 40,
  height: 40,
  backgroundColor: "transparent", // koyu arka plan
  color: "ivory",
  cursor: "pointer",
  border:"none",
  borderRadius: "0.75rem",
  transition: "0.3s",
  fontFamily:
    'Lekton',
  fontWeight:"700",
  "&:hover": {
    color: "#34dfa5",
    boxShadow: "0 0 5px rgba(52,223,165,0.6)",
    transition: "0.3s",
  },
}));

const CustomMenu = styled(Menu)(() => ({
  "& .MuiPaper-root": {
    background: "rgba(17, 17, 17, 0.55)",
    color: "#d7dedf",
    fontFamily: "Lekton",
    fontWeight: "700",
    borderRadius: "0.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(147, 185, 225, 0.2)",
    minWidth: 200,
    padding: "0.5rem 0",
  },
}));

const CustomMenuItem = styled(MenuItem)(() => ({
  fontFamily:
    'Lekton',
  fontWeight: "700",
  "&:hover": {
    backgroundColor: "rgba(147,185,225,0.15)",
    color: "#93b9e1",
  },
}));

const CustomAvatarMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CustomAvatar onClick={handleClick}>
        <Person2RoundedIcon></Person2RoundedIcon>
      </CustomAvatar>
      <CustomMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <CustomMenuItem onClick={handleClose}>
          <LoginRoundedIcon
            fontSize="medium"
            style={{ marginRight: "8px" }}
          ></LoginRoundedIcon>
          <Typography variant="body2">
            <a
              style={{ textDecoration: "none", color: "#d7dedf" }}
              href="/signin"
            >
              Sign in
            </a>
          </Typography>
        </CustomMenuItem>
        <CustomMenuItem onClick={handleClose}>
          <AccountCircle fontSize="medium" style={{ marginRight: "8px" }} />
          <Typography variant="body2">Profile</Typography>
        </CustomMenuItem>
        <CustomMenuItem onClick={handleClose}>
          <Settings fontSize="medium" style={{ marginRight: "8px" }} />
          <Typography variant="body2">Settings</Typography>
        </CustomMenuItem>
        <Divider style={{ background: "rgba(255,255,255,0.1)" }} />
        <CustomMenuItem onClick={handleClose}>
          <Logout fontSize="medium" style={{ marginRight: "8px" }} />
          <Typography variant="body2">Logout</Typography>
        </CustomMenuItem>
      </CustomMenu>
    </>
  );
};

export default CustomAvatarMenu;