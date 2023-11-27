import VersionCheck from 'react-native-version-check';
export const CheckVersion=async()=>{
        try {
          const latestVersion =await VersionCheck.getLatestVersion({
            packageName:"fitme.health.fitness.homeworkouts.equipment",
            ingnoreErrors:true
  
          })
          const CurrentVersion=VersionCheck.getCurrentVersion();
          // console.log(latestVersion,CurrentVersion)
          if(latestVersion>CurrentVersion){
            Alert.alert("Update Required","A new version of the app is available , Please update to continue using the app...",[
              {
                text:"Update Now",
                onPress:()=>Linking.openURL(
                  Platform.OS==="ios"?
                  "https://apps.apple.com/in/app/fitme-health-and-fitness-app/id6470018217"
                  :"https://play.google.com/store/apps/details?id=fitme.health.fitness.homeworkouts.equipment")
              }
            ])
          }
          else{
            // continue using app
          }
        } catch (error) {
          console.log("update Error",error)
  
        }
      }