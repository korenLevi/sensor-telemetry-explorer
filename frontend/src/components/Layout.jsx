import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export const Layout = () => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Button color="white" component={Link} to="/">
          Readings
        </Button>
        <Button color="white" component={Link} to="/summary">
          Summary
        </Button>
      </Toolbar>
    </AppBar>

    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Outlet /> 
    </Container>
  </>
);
