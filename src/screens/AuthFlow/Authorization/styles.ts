import {rem} from '../../../theme/units';
import {StyleSheet} from 'react-native';

export interface SignUpScreenStylesProps {
  isKeyboardVisible?: boolean;
}

export const useStyles = () =>
  StyleSheet.create({
    
    mainContainer:{
        justifyContent:"center",

        alignItems:"center",
        height:"100%",
        backgroundColor:"#a3481c"
    },
    icon:{
      position:"absolute",
      left:rem(0),
      top:rem(130),
      width:rem(100),
      zIndex:1,
      height:rem(300),
    },
    mainTextWrapper1: {
      left:rem(80),
      top:rem(146),
      position:"absolute",
      justifyContent: "flex-start", // aligns text to bottom
      alignItems: "flex-start",
    },
    
    mainText1: {
      marginBottom: 4,
      color: "#FFEDD5",
      fontSize:96,
    },
    mainTextWrapper2: {
      position:"absolute",
      left:rem(90),
      top:rem(201),
      justifyContent: "flex-start", // aligns text to bottom
      alignItems: "flex-start",
    },
    
    mainText2: {
      color: "#FFEDD5",
      fontSize:96,
      
    },
    
    textContainer:{
      width:"100%",
      display:"flex",
      justifyContent:"flex-end",
      alignItems:"center",
      flex:4,
    },
    buttonContainer:{
      marginTop:rem(35),
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      flex:5,
      zIndex:10
    },

    signInButton:{
      zIndex:10,
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      width:rem(288),
      backgroundColor:"#FFFBE4",
      borderColor:"#AC591A",
      margin:rem(8),
      height:rem(50),
      borderRadius:rem(25),
    },
    signUpButton:{
      zIndex:10,

      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      width:rem(288),
      margin:rem(8),
      backgroundColor:"#FFFBE4",
      borderColor:"#AC591A",
      height:rem(50),
      borderRadius:rem(25),
    },
    buttonText:{
      color:"#AC591A",
      fontSize:rem(16),
      fontWeight:"bold",
    }
  });
