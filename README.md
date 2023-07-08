Image Upscaler is an extension that enables you to upscale an image inside your browser.

It uses two different techniques to upscale the input image. The first (and the default) method is using the HTML5 Canvas API to upscale the image up to 10 times the original size. The Canvas API has a built-in interpolation method for pixel smoothing. The final result with the HTML5 method is somehow satisfactory but lacks some details and may not be sharp enough. Another method used artificial intelligence to upscale the input image by using UpscalerJS (https://github.com/thekevinscott/UpscalerJS) and TensorFlow (https://github.com/tensorflow/tfjs) libraries. This method is still experimental and currently can upscale an image up to 4x the original size. The final result is better than the previous method and has more details and sharpness but with a much slower process. For the AI method, it is recommended to use small images as the upscaling process with artificial intelligence is computationally expensive. To make it easier, you can enable the patch option and divide the input image into smaller patches before upscaling, but the final result will have the patchs borderline.

Note 1: for the Canvas API (default engine), the maximum upscale factor is 10x and for the AI engine it is 4x.
Note 2: In version (0.1.1+) a new AI method is added for upscaling. Now, the app features 3 options for upscaling. The first option is using the conventional HTML5 canvas engine. The second option is a client-side AI using (UpscalerJS and TensorFlow). The third option is using a server-side AI from clipdrop (https://clipdrop.co/apis/docs/super-resolution). Please read the info in the app UI before using each method.

You can install this app as a PWA on your mobile device, moreover, it is available as a browser extension as well as a web application:

Chrome: https://chrome.google.com/webstore/detail/gmlpefcldkdncjphjmojnakmphpcjemm  
Edge: https://microsoftedge.microsoft.com/addons/detail/kjghmljilojlifblhodppliaecalppmp  
Webapp & PWA: https://webbrowsertools.com/image-upscaler/  

---------------------------------------------------------------------------------------------------

Support & FAQ: https://mybrowseraddon.com/image-upscaler.html
