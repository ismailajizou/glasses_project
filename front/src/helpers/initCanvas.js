import { JEELIZVTOWIDGET } from "jeelizvtowidget";
import searchImage from '../assets/images/target.png'

export function init_VTOWidget(placeHolder, canvas, toggleLoading, initialSku){
    JEELIZVTOWIDGET.start({
      placeHolder,
      canvas,
      callbacks: {
        ADJUST_START: null,
        ADJUST_END: null,
        LOADING_START: toggleLoading.bind(null, true),
        LOADING_END: toggleLoading.bind(null, false)
      },
      // sku: initialSku ?? 'rayban_aviator_or_vertFlash', // SKU loadded at the beginning
      // image displayed when face is not found:
      searchImageMask: searchImage, //'https://appstatic.jeeliz.com/jeewidget/images/target.png',
      searchImageColor: 0xeeeeee, // color of loading (face not found) animation
      searchImageRotationSpeed: -0.001, // negative -> clockwise
      callbackReady: function(){
        console.log('INFO: JEELIZVTOWIDGET is ready :)');
      },
      onError: function(errorLabel){ // this function catches errors, so you can display custom integrated messages
        alert('An error happened. errorLabel =' + errorLabel)
        switch(errorLabel) {
          case 'WEBCAM_UNAVAILABLE':
            // the user has no camera, or does not want to share it.
            break;
  
          case 'INVALID_SKU':
            // the provided SKU does not match with a glasses model
            break;
  
          case 'PLACEHOLDER_NULL_WIDTH':
          case 'PLACEHOLDER_NULL_HEIGHT':
            // Something is wrong with the placeholder
            // (element whose id='JeelizVTOWidget')
            break;
            
          case 'FATAL':
          default:
            // a bit error happens:(
            break;
        } // end switch
      } // end onError()
    }) // end JEELIZVTOWIDGET.start call
  }