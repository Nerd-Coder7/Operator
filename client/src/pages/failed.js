import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Page = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Logic to retry the payment
    navigate("/all-operators");

    console.log("Retrying payment...");
  };

  const handleContactSupport = () => {
    // Logic to contact support
    navigate("/support");

    console.log("Contacting support...");
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <ErrorOutlineIcon color="error" style={{ fontSize: 80 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Failed
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" paragraph>
          Unfortunately, we were unable to process your payment. Please try again or contact our
          support team for assistance.
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            style={{ marginRight: 16 }}
          >
            Retry Payment
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleContactSupport}>
            Contact Support
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;
