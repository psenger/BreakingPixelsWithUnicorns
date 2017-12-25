
"Breaking pixels with unicorns" is a simple web app ( NodeJS with Express ) that will reads an image ( JPEG or PNG ) from a directory in the project and produce a pixelated image with HTML ```divs``` tags. 

Each html ```divs``` tag has a HTML RGBA Style value based on the pixel color depth in the image. As you can guess a large image will have a lot of pixles. So, as a fair warning, you need a small image. I have noticed with large files, you will crash the browser or even the server rendering thousands of HTML div tags.

My suggested image size is 100 by 100 and a color depth of no more than 24 bit depth.

The eventual goal of this project, is to lower the resolution and color depth of the iamge so I can turn this into a Color By Numbers project. I saw my daughter using a color by numbers app, and thought "They want 7.99 a month for that!" Ill try to make something free. Not sure how this can work yet, but It cant be that hard.

## Examples:

For example, the following image of a running fox.
![Running Fox](https://psenger.github.io/BreakingPixelsWithUnicorns/images/RunningFox.png)

Will turn into a webpage that looks like the following:
![Running Fox](https://psenger.github.io/BreakingPixelsWithUnicorns/images/ScreenShot.png)

## Running:

You need NodeJS installed and that can be pulled down from [here](https://nodejs.org/en/download/) and then 
open a terminal window or dos promot into the project and execute the following:

```bash
npm install
npm start
```

If you get errors regarding the Port that the server can run on, let me know and Ill add more documentation.

- fini -
