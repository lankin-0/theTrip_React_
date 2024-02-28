import styles from "./Sidebar.module.css";
import { Outlet } from "react-router-dom";
//Components
import Logo from "../components/Logo";
import AppNav from "../components/AppNav";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by theTrip Inc.
        </p>
      </footer>
    </div>
  );
}
export default Sidebar;
