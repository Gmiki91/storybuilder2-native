import { StyleSheet } from 'react-native';
import {Color} from '../Global';

export default StyleSheet.create({
 
  inputView: {
    width: "100%",
    height: 45,
    marginBottom: 20,
    borderBottomWidth:1,
    borderBottomColor:'black'
  },

  TextInput: {
    flex: 1,
    width: "100%",
    marginLeft:10,
  },

  forgotBtnContainer:{
    width: "100%",
    alignItems: "flex-end",
  },

  forgotBtn: {
    height: 30,
    fontSize:10,
  },

  error: {
    backgroundColor: 'red'
  }
});
