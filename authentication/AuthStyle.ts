import { StyleSheet } from 'react-native';
import {Color} from '../Global';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e3ff",
    alignItems: "center",
    justifyContent: "center",
  },

  form:{
    alignItems: "center",
    padding:20,
    borderRadius:30,
    width: "80%",
    backgroundColor: "white",
    borderColor:'black',
    borderWidth:5,
  },
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

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#3f9deb',
  },
  error: {
    backgroundColor: 'red'
  }
});
