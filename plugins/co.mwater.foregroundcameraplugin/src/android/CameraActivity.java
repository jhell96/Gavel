/*
	    Copyright 2012 Bruno Carreira - Lucas Farias - Rafael Luna - Vin�cius Fonseca.

		Licensed under the Apache License, Version 2.0 (the "License");
		you may not use this file except in compliance with the License.
		You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

		Unless required by applicable law or agreed to in writing, software
		distributed under the License is distributed on an "AS IS" BASIS,
		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		See the License for the specific language governing permissions and
   		limitations under the License.   			
 */

package co.mwater.foregroundcameraplugin;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import android.app.Activity;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PictureCallback;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.LinearLayout;

/**
 * Camera Activity Class. Configures Android camera to take picture and show it.
 */
public class CameraActivity extends Activity {

	private static final String TAG = "CameraActivity";

	private Camera mCamera;
	private CameraPreview mPreview;
	private boolean pressed = false;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(getResources().getIdentifier("foregroundcameraplugin", "layout", getPackageName()));

		// Create an instance of Camera
		mCamera = getCameraInstance();

		if (mCamera == null) {
			setResult(RESULT_CANCELED);
			finish();
			return;
		}
		
		Camera.Parameters params = mCamera.getParameters();
	    List<Camera.Size> sizes = params.getSupportedPictureSizes();
	    
	    int w = 0, h = 0;
	    for(Camera.Size s : sizes){
	    	// If larger, take it
	    	if (s.width * s.height > w * h) {
	    		w = s.width;
	    		h = s.height;
	    	}
	    }

	    params.setPictureSize(w, h);
	    params.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);

	    mCamera.setParameters(params);

		// Create a Preview and set it as the content of activity.
		mPreview = new CameraPreview(this);
		mPreview.setCamera(mCamera);
		
		
		LinearLayout preview = (LinearLayout)findViewById(getResources().getIdentifier("camera_preview", "id", getPackageName()));
		preview.addView(mPreview, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

		// Add a listener to the Capture button
		Button captureButton = (Button) findViewById(getResources().getIdentifier("button_capture", "id", getPackageName()));
		captureButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {

				if (pressed || mCamera == null)
					return;

				// Set pressed = true to prevent freezing.
				// Issue 1 at
				// http://code.google.com/p/foreground-camera-plugin/issues/detail?id=1
				pressed = true;

				// get an image from the camera
				mCamera.autoFocus(new AutoFocusCallback() {

					public void onAutoFocus(boolean success, Camera camera) {
						mCamera.takePicture(null, null, mPicture);
					}
				});
			}
		});

		Button cancelButton = (Button) findViewById(getResources().getIdentifier("button_cancel", "id", getPackageName()));
		cancelButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				pressed = false;
				setResult(RESULT_CANCELED);
				finish();
			}
		});
	}

	@Override
	protected void onDestroy() {
		if (mCamera != null) {
			try {
			    mCamera.stopPreview();
	        	mCamera.setPreviewCallback(null); 
			} catch (Exception e) {
				Log.d(TAG, "Exception stopping camera: " + e.getMessage());
			}
			mCamera.release(); // release the camera for other applications
			mCamera = null;
		}
		super.onDestroy();
	}

	/** A safe way to get an instance of the Camera object. */
	public static Camera getCameraInstance() {
		Camera c = null;
		try {
			c = Camera.open(); // attempt to get a Camera instance
		} catch (Exception e) {
			// Camera is not available (in use or does not exist)
			Log.d(TAG, "Camera not available: " + e.getMessage());
		}
		return c; // returns null if camera is unavailable
	}

	private PictureCallback mPicture = new PictureCallback() {

		public void onPictureTaken(byte[] data, Camera camera) {

			Uri fileUri = (Uri) getIntent().getExtras().get(
					MediaStore.EXTRA_OUTPUT);

			File pictureFile = new File(fileUri.getPath());

			try {
				FileOutputStream fos = new FileOutputStream(pictureFile);
				fos.write(data);
				fos.close();
			} catch (FileNotFoundException e) {
				Log.d(TAG, "File not found: " + e.getMessage());
			} catch (IOException e) {
				Log.d(TAG, "Error accessing file: " + e.getMessage());
			}
			setResult(RESULT_OK);
			pressed = false;
			finish();
		}
	};
}