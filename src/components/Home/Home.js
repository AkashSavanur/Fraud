import React, { useState } from "react";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";

const Home = () => {
  const [transaction, setTransaction] = useState({
    amount: "",
    method: "",
    category: "",
    quantity: "",
    customerAge: "",
    customerLocation: "",
    device: "",
    IP: "",
    day: "",
    month: "",
    hour: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value, // Update the specific field in the transaction state
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        url: "http://localhost:3000/transaction",
        data: {
          amount: parseFloat(transaction.amount) || 0,
          method: transaction.method || "",
          category: transaction.category || "",
          quantity: parseInt(transaction.quantity) || 0,
          customerAge: parseInt(transaction.customerAge) || 0,
          customerLocation: transaction.customerLocation || "",
          device: transaction.device || "",
          IP: transaction.IP || "",
          day: parseInt(transaction.day) || 0,
          month: parseInt(transaction.month) || 0,
          hour: parseInt(transaction.hour) || 0,
        },
      };

      const response = await axios.request(options);

      const data = response.data;
      console.log("Transaction processed:", data);

      if (data.isFraud) {
        alert("The transaction is flagged as fraud.");
      } else {
        alert("The transaction is not fraud.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    }
  };

  const handlePhotoSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a photo to upload.");
      return;
    }

    // Step 1: Send the image to the /extract-photo endpoint
    const formData = new FormData();
    formData.append("photo", selectedFile); // Append only the file

    try {
      // Send the file to the backend's /extract-photo endpoint
      const extractResponse = await fetch(
        "http://localhost:3000/extractPhoto",
        {
          method: "POST",
          body: formData, // The file is sent as FormData
        }
      );

      // Parse the response from the backend
      const extractedData = await extractResponse.json();

      // Check if the first request was successful
      if (!extractResponse.ok) {
        console.error("Error extracting data from photo:", extractedData);
        alert("Failed to extract data from the photo. Please try again.");
        return;
      }

      console.log("Extracted Data:", extractedData);

      // Step 2: Use the extracted data and send it to the /transaction API
      const transactionResponse = await fetch(
        "http://localhost:3000/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(extractedData), // Send the extracted data as JSON
        }
      );

      const transactionData = await transactionResponse.json();

      if (transactionResponse.ok) {
        console.log("Transaction processed:", transactionData);
        if (transactionData.isFraud) {
          alert("The transaction is flagged as fraud.");
        } else {
          alert("The transaction is not fraud.");
        }
      } else {
        console.error("Error processing transaction:", transactionData);
        alert("Failed to process transaction.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        text: "An error occurred during the submission process. Please try again.",
        icon: "error",
      });
    } finally {
      setSelectedFile(null); // Reset the file input after both requests are done
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
      },
      text: {
        primary: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              color: "#000000",
              backgroundColor: "#F7F7F7", // Light grey for input background
              borderRadius: "5px", // Rounded input fields
              padding: "10px", // Padding inside the inputs
            },
            "& .MuiInputLabel-root": {
              color: "#6e6e6e", // Softer label color
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b0b0b0", // Hover effect
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#0071E3", // Focus color - Apple blue
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#0071E3", // Border color on focus - Apple blue
              },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            backgroundColor: "#0071E3", // Apple Blue
            borderRadius: "20px", // Rounded corners
            padding: "10px 20px", // Padding for the button
            textTransform: "none", // Remove uppercase transformation
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow
            transition: "all 0.3s ease", // Smooth transitions
            "&:hover": {
              backgroundColor: "#005BB5", // Darker on hover
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow on hover
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" style={{ padding: "40px 0" }}>
        <Typography
          variant="h4"
          align="center"
          style={{
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "40px",
            marginTop: "40px",
          }}
          gutterBottom
        >
          Transaction Form
        </Typography>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          style={{
            color: "#000",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#0071E3",
                  borderRadius: "20px",
                  padding: "10px 20px",
                }}
              >
                {selectedFile ? "Submit Photo" : "Choose Photo"}
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                  }}
                />
              </Button>

              {selectedFile && (
                <Button
                  variant="contained"
                  style={{
                    marginLeft: "10px",
                    color: "#ffffff",
                    backgroundColor: "#000000",
                    borderRadius: "20px",
                    padding: "10px 20px",
                  }}
                  onClick={handlePhotoSubmit}
                >
                  Submit Photo
                </Button>
              )}

              {selectedFile && (
                <Typography
                  variant="body2"
                  style={{ marginTop: "10px", color: "#6e6e6e" }}
                >
                  {selectedFile.name} selected
                </Typography>
              )}
            </Grid>
            {/* Amount Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={transaction.amount}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Method Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Method"
                name="method"
                type="text"
                value={transaction.method}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Category Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                type="text"
                value={transaction.category}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Quantity Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={transaction.quantity}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Customer Age Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Age"
                name="customerAge"
                type="number"
                value={transaction.customerAge}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Customer Location Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Location"
                name="customerLocation"
                type="text"
                value={transaction.customerLocation}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Device Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device"
                name="device"
                type="text"
                value={transaction.device}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* IP Address Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IP Address"
                name="IP"
                type="text"
                value={transaction.IP}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Day"
                name="day"
                type="number"
                value={transaction.day}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Month"
                name="month"
                type="number"
                value={transaction.month}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Hour Field */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hour"
                name="hour"
                type="number"
                value={transaction.hour}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Day Field */}
            

            {/* Month Field */}
            

            <Grid
              item
              xs={12}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#0071E3",
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "10px 20px",
                }}
              >
                Submit Transaction
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
