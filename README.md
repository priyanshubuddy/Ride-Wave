# Ride-Wave

## Overview

Ride-Wave is a ride-sharing application that allows users to book rides, view ride options, and manage their ride preferences. The application is built with a React Native frontend and a Node.js backend.

## Native-Frontend

### Technologies Used

- **Expo**: For building and deploying the React Native application.
- **React Native Elements**: For UI components.
- **React Navigation**: For handling navigation within the app.
- **React Native Maps**: For displaying maps and directions.
- **Redux Toolkit**: For state management.
- **Tailwind CSS**: For styling.
- **Google APIs**: Utilized for location and mapping services, including Directions API, Distance Matrix, and Places API.

### Setup Instructions

1. **Initialize the Project**:
   ```bash
   expo init ride-wave
   cd ride-wave
   ```

2. **Start the Application**:
   ```bash
   npm expo start --tunnel
   ```

3. **Install Dependencies**:
   ```bash
   npm install @reduxjs/toolkit react-redux @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-elements react-native-vector-icons react-native-google-places-autocomplete react-native-maps react-native-maps-directions
   ```

4. **Environment Configuration**:
   - Ensure that `config.json` is set up with your Google Maps API key and other necessary configurations.

### Key Components

- **HomeScreen**: The main screen where users can search for ride options.
- **MapScreen**: Displays the map and allows users to select their destination.
- **LoginScreen & SignUpScreen**: For user authentication.

### File Structure

- `components/`: Contains reusable UI components.
- `screen/`: Contains the main screens of the application.
- `src/redux/`: Contains Redux slices and store configuration.

## Backend

### Technologies Used

- **Node.js**: For server-side logic.
- **Express**: For building the RESTful API.
- **Mongoose**: For MongoDB object modeling.
- **Winston**: For logging.
- **dotenv**: For environment variable management.

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm run dev
   ```

3. **Environment Configuration**:
   - Create a `.env` file with the necessary environment variables, such as `MONGODB_URI` and `PORT`.

### Key Features

- **User Authentication**: Handles user login and registration.
- **Ride Management**: Allows users to create and view rides.

### File Structure

- `src/app.js`: Main entry point of the application.
- `src/routes/`: Contains route definitions.
- `src/controllers/`: Contains business logic for handling requests.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.
