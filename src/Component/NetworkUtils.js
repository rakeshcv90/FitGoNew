import NetInfo from '@react-native-community/netinfo'
let Disconnected=false;
export const setupNetworkListner=(onConnectionChange,ThresoldTime)=>{
    NetInfo.addEventListener(state=>{
        if(state.isConnected){
            Disconnected=false
            if(state.isConnected){
                onConnectionChange(Disconnected);
            }
        }
        else{
            if(!Disconnected){
                Disconnected=true
                    if(Disconnected){
                        onConnectionChange(Disconnected);
                       
                    }
            }
        }
    })
    return(()=>NetInfo.remove())
}