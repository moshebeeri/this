package com.groupys;

import com.facebook.react.ReactActivity;
import com.yoloci.fileupload.FileUploadPackage;
 import android.content.Intent;
import android.app.Activity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "groupys";
    }

     @Override
       public void onNewIntent(Intent intent) {
           super.onNewIntent(intent);
           setIntent(intent);    //must store the new intent unless getIntent() will return the old one

       }


}
