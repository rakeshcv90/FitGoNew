module.exports = {
    project: {
      ios: {},
      android: {},
    },
    assets: ['./assets/fonts'], // adjust the path based on your project structure
    dependencies: {
      'react-native-google-mobile-ads': {
        platforms: {
          ios: null, // Disable auto-linking for iOS, handle manually
        },
      },
    },
  }; 